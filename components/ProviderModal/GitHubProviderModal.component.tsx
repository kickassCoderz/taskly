import { createResourceBaseQueryKey, EResourceBaseQueryKeyType, useGetList } from '@kickass-admin'
import { Button, Container, Link, Modal, Table, Text } from '@nextui-org/react'
import { GithubIcon } from 'components/Icons'
import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { EFilterOperators, TWebhook } from 'types'

import { useAppwrite, useSessions } from '../../hooks'

const paginationRegex = /<.*page=(?<last>[0-9]{1,}).*>; rel="last"/

const ProviderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const queryClient = useQueryClient()
    const sessions = useSessions()
    const session = useMemo(() => {
        return sessions?.find(item => item.provider === 'github')
    }, [sessions])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const appwrite = useAppwrite()

    const { data: repositories, isLoading } = useQuery(
        ['github', 'repositories', { page, type: 'owner' }],
        async () => {
            if (!session) {
                return undefined
            }

            const response = await fetch(`https://api.github.com/user/repos?page=${page}&type=owner`, {
                headers: { authorization: `token ${session.providerAccessToken}` }
            })

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`)
            }

            const { last } = response.headers.get('link')?.match(paginationRegex)?.groups || {}
            const result: any[] = await response.json()

            if (last) {
                setTotal(+last)
            }

            return result
        },
        {
            enabled: !!session && !!isOpen,
            keepPreviousData: true
        }
    )

    const repositoriesToSearch = useMemo<string[]>(
        () => repositories?.map(item => item.id.toString()) || [],
        [repositories]
    )

    const { data: webhooks, isLoading: isConnectedMapLoading } = useGetList<TWebhook[], Error>(
        {
            resource: 'webhooks',
            params: {
                pagination: {
                    page: 1,
                    perPage: 100
                },
                filter: [
                    {
                        operator: EFilterOperators.Eq,
                        field: 'resourceId',
                        value: repositoriesToSearch
                    }
                ]
            }
        },
        {
            enabled: !!session && !!isOpen
        }
    )

    const isConnectedMap = useMemo<Record<string, boolean>>(() => {
        if (!webhooks || !session) {
            return {}
        }

        const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session.userId}`

        return webhooks?.reduce((acc, item) => {
            return {
                ...acc,
                [item.resourceId]: item.url === webhookUrl
            }
        }, {})
    }, [webhooks, session])

    const { mutate: connectRepository, isLoading: isConnectingRepository } = useMutation({
        mutationFn: async (repository: { id: number; full_name: string }) => {
            if (!session) {
                return undefined
            }

            const repositoryUrl = `https://api.github.com/repos/${repository.full_name}/hooks`
            const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session.userId}`
            const webhookSecret = (Math.random() + 1).toString(36).substring(2) // TODO maybe some other secret generation method

            const response = await fetch(repositoryUrl, {
                method: 'POST',
                headers: { authorization: `token ${session.providerAccessToken}` },
                body: JSON.stringify({
                    config: {
                        url: webhookUrl,
                        content_type: 'json',
                        secret: webhookSecret
                    },
                    events: ['issues'],
                    active: true
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`)
            }

            const result = await response.json()

            const webhook = await appwrite.database.createDocument('webhooks', 'unique()', {
                provider: 'github',
                userId: session.userId,
                url: webhookUrl,
                secret: webhookSecret,
                webhookId: result.id.toString(),
                resourceId: repository.id.toString()
            })

            await appwrite.functions.createExecution(
                'github-issues-import',
                JSON.stringify({ webhook, pT: session.providerAccessToken }),
                true
            )

            return webhook
        },
        onSuccess: () => {
            // just invalidate all webhooks, appwrite api fast
            const queryKeysToInvalidate = [createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, 'webhooks')]

            queryKeysToInvalidate.forEach(queryKey => queryClient.invalidateQueries(queryKey))
        }
    })

    return (
        <Modal
            closeButton
            scroll
            css={{
                height: '50vh',
                minWidth: '100%'
            }}
            aria-labelledby="providers-modal"
            open={isOpen}
            onClose={onClose}
        >
            <Modal.Header>
                <Container display="flex" direction="row">
                    <GithubIcon />
                    <Text id="modal-title" size={18}>
                        GitHub connection
                    </Text>
                </Container>
            </Modal.Header>
            <Modal.Body>
                {/* <Input
                    type="search"
                    placeholder="Search repositories"
                    value={search}
                    onChange={event => {
                        setSearch(event.target.value || '')

                        // TODO actually search
                    }}
                    aria-labelledby="search-repositories"
                /> */}
                <Table
                    fixed
                    aria-label="Example table with static content"
                    css={{
                        height: 'auto',
                        minWidth: '100%'
                    }}
                    sticked
                    containerCss={{
                        overflow: 'auto scroll'
                    }}
                >
                    <Table.Header>
                        <Table.Column>Repositories</Table.Column>
                        <Table.Column></Table.Column>
                    </Table.Header>
                    <Table.Body loadingState={!repositories && isLoading}>
                        {repositories?.map(repository => {
                            const isConnected = isConnectedMap[repository.id] || false

                            return (
                                <Table.Row key={repository.id}>
                                    <Table.Cell>
                                        <Link
                                            target="_blank"
                                            href={repository.html_url}
                                            title={repository.name}
                                            rel="noreferrer"
                                            color="text"
                                            underline
                                        >
                                            {repository.name}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell
                                        css={{
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            color={isConnected ? 'success' : 'primary'}
                                            ghost={!isConnected}
                                            disabled={isConnectedMapLoading}
                                            onClick={() => {
                                                if (isConnectingRepository) {
                                                    return
                                                }

                                                if (isConnected) {
                                                    // TODO potentially here we can disable connection

                                                    return
                                                }

                                                connectRepository(repository)
                                            }}
                                        >
                                            {isConnected ? '✔' : 'Connect'}
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Modal.Body>
            <Modal.Footer justify="space-between">
                {!!total ? (
                    <Table.Pagination
                        noMargin
                        align="center"
                        onPageChange={page => {
                            setPage(page)
                        }}
                        total={total}
                        page={page}
                    />
                ) : (
                    <div />
                )}
                <Button auto flat color="error" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ProviderModal
