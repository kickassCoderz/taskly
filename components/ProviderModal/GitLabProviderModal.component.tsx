import { Button, Container, Input, Link, Modal, Table, Text } from '@nextui-org/react'
import { Models, Query } from 'appwrite'
import { GitlabIcon } from 'components/Icons'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { useAppwrite, useSessions } from '../../hooks'

const ProviderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const queryClient = useQueryClient()
    const sessions = useSessions()
    const session = useMemo(() => {
        return sessions?.find(item => item.provider === 'gitlab')
    }, [sessions])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const appwrite = useAppwrite()

    const { data: repositories, isLoading } = useQuery(
        ['gitlab', 'repositories', { page, owned: true, perPage: 30, search }],
        async () => {
            if (!session) {
                return undefined
            }

            const response = await fetch(
                `https://gitlab.com/api/v4/projects?page=${page}&owned=true&per_page=30&search=${search}`,
                {
                    headers: {
                        authorization: `Bearer ${session.providerAccessToken}`,
                        'content-type': 'application/json'
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`)
            }

            const total = response.headers.get('x-total-pages')
            const result: any[] = await response.json()

            if (total) {
                setTotal(+total)
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

    const { data: webhooks, isLoading: isConnectedMapLoading } = useQuery(
        ['webhooks', 'gitlab', { resourceId: repositoriesToSearch }],
        () => {
            return appwrite.database.listDocuments<Models.Document & { resourceId: string; url: string }>('webhooks', [
                Query.equal('resourceId', repositoriesToSearch)
            ])
        },
        { enabled: !!session }
    )

    const isConnectedMap = useMemo<Record<string, boolean>>(() => {
        if (!webhooks || !session) {
            return {}
        }

        const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITLAB_WEBHOOK_ENDPOINT}/${session.userId}`

        return webhooks?.documents.reduce((acc, item) => {
            return {
                ...acc,
                [item.resourceId]: item.url === webhookUrl
            }
        }, {})
    }, [webhooks, session])

    const { mutate: connectRepository, isLoading: isConnectingRepository } = useMutation({
        mutationFn: async (repository: { id: number; path_with_namespace: string }) => {
            if (!session) {
                return undefined
            }

            const repositoryUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
                repository.path_with_namespace
            )}/hooks`
            const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITLAB_WEBHOOK_ENDPOINT}/${session.userId}`
            const webhookSecret = (Math.random() + 1).toString(36).substring(2) // TODO maybe some other secret generation method

            const response = await fetch(repositoryUrl, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${session.providerAccessToken}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    url: webhookUrl,
                    token: webhookSecret,
                    issues_events: true,
                    push_events: false
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`)
            }

            const result = await response.json()

            const webhook = await appwrite.database.createDocument('webhooks', 'unique()', {
                provider: 'gitlab',
                userId: session.userId,
                url: webhookUrl,
                secret: webhookSecret,
                webhookId: result.id.toString(),
                resourceId: repository.id.toString()
            })

            await appwrite.functions.createExecution(
                'gitlab-issues-import',
                JSON.stringify({ webhook, pT: session.providerAccessToken }),
                true
            )

            return webhook
        },
        onSuccess: data => {
            const updater = (current: any) => {
                return {
                    total: (current?.total || 0) + 1,
                    documents: [...(current?.documents || []), data]
                }
            }

            queryClient.setQueryData(['webhooks', 'gitlab', { resourceId: repositoriesToSearch }], updater)
            queryClient.setQueryData(['webhooks', 'gitlab'], updater)
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
                    <GitlabIcon />
                    <Text id="modal-title" size={18}>
                        GitLab connection
                    </Text>
                </Container>
            </Modal.Header>
            <Modal.Body>
                <Input
                    type="search"
                    placeholder="Search repositories"
                    value={search}
                    onChange={event => {
                        setSearch(event.target.value || '')
                    }}
                    aria-labelledby="search-repositories"
                />
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
                                            href={repository.web_url}
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
