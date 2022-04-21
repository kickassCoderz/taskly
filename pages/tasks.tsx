import { Button, Text, Container, Table, Link } from '@nextui-org/react'
import { Models, Query } from 'appwrite'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { GitHubProviderModal } from '../components'
import { useAppwrite } from '../hooks'

const HomePage = () => {
    const appwrite = useAppwrite()
    const [isProviderModalOpen, setProviderModalOpen] = useState(false)

    const { data: session } = useQuery<Models.Session | undefined>(
        'session',
        async () => {
            let { sessions } = await appwrite.account.getSessions().catch(error => {
                console.error(error)

                return { sessions: [] }
            })
            sessions = Object.values(sessions)

            if (!sessions.find(item => item.provider === 'github')) {
                appwrite.account.createOAuth2Session('github', window.location.toString(), window.location.toString(), [
                    'user:email',
                    'repo'
                ])

                return undefined
            }

            const currentSession = sessions[0]

            return currentSession
        },
        { enabled: !!appwrite }
    )

    const queryClient = useQueryClient()

    const { data: tasks, isLoading } = useQuery(
        ['tasks'],
        () => {
            return appwrite.database.listDocuments<
                Models.Document & { title: string; content: string; link: string; provider: string }
            >('tasks')
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

    const isGitHubConnected = !!githubWebhooks?.documents.length

    return (
        <>
            <Container fluid>
                <Text h1>Tasks</Text>

                {typeof githubWebhooks !== 'undefined' && (
                    <Button
                        iconRight={<Image width="20" height="20" src="/github.svg" alt="Connect GitHub" />}
                        color="primary"
                        ghost
                        disabled={!session}
                        onClick={() => {
                            setProviderModalOpen(true)
                        }}
                    >
                        {isGitHubConnected ? 'Manage' : 'Connect'} GitHub
                    </Button>
                )}
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
            <GitHubProviderModal isOpen={isProviderModalOpen} onClose={() => setProviderModalOpen(false)} />
        </>
    )
}

export default HomePage
