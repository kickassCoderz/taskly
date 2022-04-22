import React, { useMemo, useState } from 'react'
import { Modal, Button, Text, Table, Link } from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Models, Query } from 'appwrite'
import { useAppwrite } from '../../hooks'

const githubPaginationRegex = /<.*page=(?<last>[0-9]{1,}).*>; rel="last"/

const ProviderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const queryClient = useQueryClient()
    const session: Models.Session | undefined = queryClient.getQueryData(['session'])
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

            const { last } = response.headers.get('link')?.match(githubPaginationRegex)?.groups || {}
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

    const { data: githubWebhooks, isLoading: isConnectedMapLoading } = useQuery(
        ['webhooks', 'github', { resourceId: repositoriesToSearch }],
        () => {
            return appwrite.database.listDocuments<Models.Document & { resourceId: string; url: string }>('webhooks', [
                Query.equal('resourceId', repositoriesToSearch)
            ])
        },
        { enabled: !!session }
    )

    const isConnectedMap = useMemo<Record<string, boolean>>(() => {
        if (!githubWebhooks || !session) {
            return {}
        }

        const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session.userId}`

        return githubWebhooks?.documents.reduce((acc, item) => {
            return {
                ...acc,
                [item.resourceId]: item.url === webhookUrl
            }
        }, {})
    }, [githubWebhooks, session])

    const { mutate: connectWithGitHub, isLoading: isConnectingWithGitHub } = useMutation({
        mutationFn: async (repository: { id: number; full_name: string }) => {
            if (!session) {
                return undefined
            }

            const gitHubRepositoryUrl = `https://api.github.com/repos/${repository.full_name}/hooks`
            const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session.userId}`
            const webhookSecret = (Math.random() + 1).toString(36).substring(2) // TODO maybe some other secret generation method

            const result = await fetch(gitHubRepositoryUrl, {
                method: 'POST',
                headers: { authorization: `token ${session.providerAccessToken}` },
                body: JSON.stringify({
                    config: {
                        url: `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session.userId}`,
                        content_type: 'json',
                        secret: webhookSecret
                    },
                    events: ['issues'],
                    active: true
                })
            }).then(res => res.json())

            const webhook = await appwrite.database.createDocument('webhooks', 'unique()', {
                provider: 'github',
                userId: session.userId,
                url: webhookUrl,
                secret: webhookSecret,
                webhookId: result.id.toString(),
                resourceId: repository.id.toString()
            })

            return webhook
        },
        onSuccess: data => {
            queryClient.setQueryData(['webhooks', 'github', { resourceId: repositoriesToSearch }], (current: any) => {
                return {
                    total: current?.total + 1,
                    documents: [...current?.documents, data]
                }
            })
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
                <Text id="modal-title" size={18}>
                    GitHub connection
                </Text>
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
                /> */}
                <Table
                    fixed
                    aria-label="Example table with static content"
                    css={{
                        height: 'auto',
                        minWidth: '100%'
                    }}
                    sticked
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
                                                if (isConnectingWithGitHub) {
                                                    return
                                                }

                                                if (isConnected) {
                                                    // TODO potentially here we can disable connection

                                                    return
                                                }

                                                connectWithGitHub(repository)
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
