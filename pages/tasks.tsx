import { Button, Text, Container, Table } from '@nextui-org/react'
import { Models } from 'appwrite'
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

    const { data: hasGitHubWebhook } = useQuery(
        ['github', 'hooks', 'enabled'],
        async () => {
            if (!session) {
                return undefined
            }

            const result: any[] = await fetch(gitHubRepositoryUrl, {
                headers: { authorization: `token ${session?.providerAccessToken}` }
            }).then(res => res.json())

            return result.some(
                item =>
                    item.config.url === `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session?.userId}`
            )
        },
        {
            enabled: !!session
        }
    )

    const { mutate: connectWithGitHub, isLoading: isConnectingWithGitHub } = useMutation({
        mutationFn: async () => {
            if (!session) {
                return undefined
            }

            await fetch(gitHubRepositoryUrl, {
                method: 'POST',
                headers: { authorization: `token ${session?.providerAccessToken}` },
                body: JSON.stringify({
                    config: {
                        url: `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session?.userId}`,
                        content_type: 'json'
                    },
                    events: ['issues'],
                    active: true
                })
            }).then(res => res.json())
        },
        onSuccess: () => {
            queryClient.setQueryData(['github', 'hooks', 'enabled'], true)
        }
    })

    return (
        <Container fluid>
            <Text h1>Tasks</Text>

            {typeof hasGitHubWebhook !== 'undefined' && !hasGitHubWebhook && (
                <Button
                    iconRight={<Image width="20" height="20" src="/github.svg" alt="Connect GitHub" />}
                    color="primary"
                    ghost
                    disabled={!session || isConnectingWithGitHub}
                    onClick={() => {
                        connectWithGitHub()
                    }}
                >
                    Connect GitHub
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
