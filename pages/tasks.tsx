import { Button, Text, Container, Table } from '@nextui-org/react'
import { Models, Query } from 'appwrite'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useAppwrite } from '../hooks'

// TODO select repositories
const gitHubRepositoryUrl = 'https://api.github.com/repos/capjavert/pucko/hooks'

const HomePage = () => {
    const appwrite = useAppwrite()
    const [session, setSession] = useState<Models.Session>()

    useEffect(() => {
        const createSession = async () => {
            let { sessions } = await appwrite.account.getSessions().catch(error => {
                console.error(error)

                return { sessions: [] }
            })
            sessions = Object.values(sessions)

            if (!sessions.find(item => item.provider === 'github')) {
                await appwrite.account.createOAuth2Session(
                    'github',
                    window.location.toString(),
                    window.location.toString(),
                    ['user:email', 'admin:repo_hook']
                )
            }

            const currentSession = sessions[0]

            setSession(currentSession)
        }

        createSession()
    }, [appwrite])

    const queryClient = useQueryClient()

    const { data: tasks, isLoading } = useQuery(
        ['tasks'],
        () => {
            return appwrite.database.listDocuments<Models.Document & { title: string; content: string }>('tasks')
        },
        { enabled: !!session }
    )

    const { data: githubWebhooks } = useQuery(
        ['webhooks', 'github'],
        () => {
            return appwrite.database.listDocuments<Models.Document & { provider: string }>('webhooks', [
                Query.equal('provider', 'github')
            ])
        },
        { enabled: !!session }
    )

    const isGitHubConnected = !!githubWebhooks?.documents.length

    const { mutate: connectWithGitHub, isLoading: isConnectingWithGitHub } = useMutation({
        mutationFn: async () => {
            if (!session) {
                return undefined
            }

            const webhookUrl = `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session?.userId}`
            const webhookSecret = (Math.random() + 1).toString(36).substring(2) // TODO maybe some other secret generation method

            const result = await fetch(gitHubRepositoryUrl, {
                method: 'POST',
                headers: { authorization: `token ${session?.providerAccessToken}` },
                body: JSON.stringify({
                    config: {
                        url: `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session?.userId}`,
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
                providerId: result.id.toString(),
                providerUrl: result.url
            })

            return webhook
        },
        onSuccess: data => {
            queryClient.setQueryData(['webhooks', 'github'], (current: any) => {
                return {
                    total: current?.total + 1,
                    documents: [...current?.documents, data]
                }
            })
        }
    })

    return (
        <Container fluid>
            <Text h1>Tasks</Text>

            {typeof githubWebhooks !== 'undefined' && (
                <Button
                    iconRight={<Image width="20" height="20" src="/github.svg" alt="Connect GitHub" />}
                    color="primary"
                    ghost
                    disabled={!session || isConnectingWithGitHub}
                    onClick={() => {
                        if (isGitHubConnected) {
                            alert('TODO manage modal')

                            return
                        }

                        connectWithGitHub()
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
                </Table.Header>
                <Table.Body loadingState={!tasks && isLoading}>
                    {tasks?.documents?.map(task => (
                        <Table.Row key={task.$id}>
                            <Table.Cell>{task.$id}</Table.Cell>
                            <Table.Cell>{task.title}</Table.Cell>
                            <Table.Cell>{task.content?.substring(0, 32)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    )
}

export default HomePage
