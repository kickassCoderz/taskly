import { Button, Text, Container, Table, Link } from '@nextui-org/react'
import { Models, Query } from 'appwrite'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { GitHubProviderModal, GitLabProviderModal } from '../components'
import { useAppwrite } from '../hooks'

const HomePage = () => {
    const appwrite = useAppwrite()
    const [isGitHubProviderModalOpen, setGitHubProviderModalOpen] = useState(false)
    const [isGitLabProviderModalOpen, setGitLabProviderModalOpen] = useState(false)

    const { data: sessions } = useQuery<Models.Session[] | undefined>(
        'session',
        async () => {
            let { sessions } = await appwrite.account.getSessions().catch(error => {
                console.error(error)

                return { sessions: [] }
            })
            sessions = Object.values(sessions)

            return sessions
        },
        { enabled: !!appwrite }
    )
    const session = sessions?.[0]

    const queryClient = useQueryClient()

    const { data: tasks, isLoading } = useQuery(
        ['tasks'],
        () => {
            return appwrite.database.listDocuments<
                Models.Document & { title: string; content: string; link: string; provider: string }
            >('tasks', [], 100, 0, undefined, undefined, undefined, ['DESC'])
        },
        { enabled: !!session }
    )

    const { data: githubWebhooks } = useQuery(
        ['webhooks', 'github'],
        () => {
            if (!session) {
                return undefined
            }

            return appwrite.database.listDocuments<Models.Document & { provider: string }>(
                'webhooks',
                [
                    Query.equal('provider', 'github'),
                    Query.equal('url', `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session.userId}`)
                ],
                1
            )
        },
        { enabled: !!session }
    )

    const { data: gitlabWebhooks } = useQuery(
        ['webhooks', 'gitlab'],
        () => {
            if (!session) {
                return undefined
            }

            return appwrite.database.listDocuments<Models.Document & { provider: string }>(
                'webhooks',
                [
                    Query.equal('provider', 'gitlab'),
                    Query.equal('url', `${process.env.NEXT_PUBLIC_TASKLY_GITLAB_WEBHOOK_ENDPOINT}/${session.userId}`)
                ],
                1
            )
        },
        { enabled: !!session }
    )

    const isGitHubConnected = !!githubWebhooks?.documents.length
    const isGitLabConnected = !!gitlabWebhooks?.documents.length

    useEffect(() => {
        const unsubscribe = appwrite.subscribe(
            'collections.tasks.documents',
            ({ event, payload }: { event: string; payload: Models.Document }) => {
                switch (event) {
                    case 'database.documents.create':
                        queryClient.setQueryData<Models.DocumentList<Models.Document>>(['tasks'], current => {
                            const newDocuments = [payload, ...(current?.documents || [])]

                            return {
                                total: newDocuments.length,
                                documents: newDocuments
                            }
                        })
                        break
                    case 'database.documents.update':
                        queryClient.setQueryData<Models.DocumentList<Models.Document>>(['tasks'], current => {
                            const newDocuments =
                                current?.documents?.map(item => {
                                    if (item.$id === payload.$id) {
                                        return payload
                                    }

                                    return item
                                }) || []

                            return {
                                total: newDocuments.length,
                                documents: newDocuments
                            }
                        })
                        break
                    case 'database.documents.delete':
                        queryClient.setQueryData<Models.DocumentList<Models.Document>>(['tasks'], current => {
                            const newDocuments = current?.documents?.filter(item => item.$id !== payload.$id) || []

                            return {
                                total: newDocuments.length,
                                documents: newDocuments
                            }
                        })
                        break
                    default:
                        console.error('unknown event', event)

                        break
                }
            }
        )

        return () => {
            unsubscribe()
        }
    }, [appwrite, queryClient, sessions])

    const router = useRouter()

    useEffect(() => {
        const manageParam = router.query.manage

        if (!manageParam) {
            return
        }

        if (sessions?.some(item => item.provider === manageParam)) {
            const queryWithoutManage = { ...router.query }
            delete queryWithoutManage.manage

            router.replace(
                {
                    pathname: router.pathname,
                    query: queryWithoutManage
                },
                undefined,
                {
                    shallow: true
                }
            )

            switch (manageParam) {
                case 'github':
                    setGitHubProviderModalOpen(true)
                    break
                case 'gitlab':
                    setGitLabProviderModalOpen(true)
                    break
                default:
                    break
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.manage, sessions])

    return (
        <>
            <Container fluid>
                <Text h1>Tasks</Text>
                <Container display="flex" direction="row">
                    {(!session || typeof githubWebhooks !== 'undefined') && (
                        <Button
                            iconRight={<Image width="20" height="20" src="/github.svg" alt="Connect GitHub" />}
                            color="primary"
                            ghost
                            onClick={() => {
                                if (!sessions?.find(item => item.provider === 'github')) {
                                    const redirectUrl = new URL(window.location.toString())
                                    redirectUrl.searchParams.append('manage', 'github')

                                    appwrite.account.createOAuth2Session(
                                        'github',
                                        redirectUrl.toString(),
                                        redirectUrl.toString(),
                                        ['user:email', 'repo']
                                    )
                                } else {
                                    setGitHubProviderModalOpen(true)
                                }
                            }}
                        >
                            {isGitHubConnected ? 'Manage' : 'Connect'} GitHub
                        </Button>
                    )}
                    {(!session || typeof gitlabWebhooks !== 'undefined') && (
                        <Button
                            css={{
                                marginLeft: 20
                            }}
                            iconRight={<Image width="20" height="20" src="/gitlab.svg" alt="Connect GitLab" />}
                            color="primary"
                            ghost
                            onClick={() => {
                                if (!sessions?.find(item => item.provider === 'gitlab')) {
                                    const redirectUrl = new URL(window.location.toString())
                                    redirectUrl.searchParams.append('manage', 'gitlab')

                                    appwrite.account.createOAuth2Session(
                                        'gitlab',
                                        redirectUrl.toString(),
                                        redirectUrl.toString(),
                                        ['read_user', 'api']
                                    )
                                } else {
                                    setGitLabProviderModalOpen(true)
                                }
                            }}
                        >
                            {isGitLabConnected ? 'Manage' : 'Connect'} GitLab
                        </Button>
                    )}
                </Container>
                <Table
                    aria-label="Example table with static content"
                    css={{
                        height: 'auto',
                        minWidth: '100%'
                    }}
                >
                    <Table.Header>
                        <Table.Column>ID</Table.Column>
                        <Table.Column>TITLE</Table.Column>
                        <Table.Column>CONTENT</Table.Column>
                        <Table.Column>LINK</Table.Column>
                    </Table.Header>
                    <Table.Body loadingState={!tasks && isLoading}>
                        {tasks?.documents?.map(task => (
                            <Table.Row key={task.$id}>
                                <Table.Cell>{task.$id}</Table.Cell>
                                <Table.Cell>{task.title}</Table.Cell>
                                <Table.Cell>{task.content?.substring(0, 32)}</Table.Cell>
                                {!!task.link && (
                                    <Table.Cell>
                                        <Link
                                            target="_blank"
                                            title="Open original issue"
                                            href={task.link}
                                            underline
                                        >{`${task.provider || 'original'} issue`}</Link>
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Container>
            <GitHubProviderModal isOpen={isGitHubProviderModalOpen} onClose={() => setGitHubProviderModalOpen(false)} />
            <GitLabProviderModal isOpen={isGitLabProviderModalOpen} onClose={() => setGitLabProviderModalOpen(false)} />
        </>
    )
}

export default HomePage
