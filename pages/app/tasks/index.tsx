import { useGetList, useLogin } from '@kickass-admin'
import { Button, Container, Grid, Link as NextUILink, Row, Table, Text } from '@nextui-org/react'
import {
    AppLayout,
    AppPageAppBar,
    AppPageContainer,
    GithubIcon,
    GitHubProviderModal,
    GitlabIcon,
    GitLabProviderModal
} from 'components'
import { useSessions } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { EAuthProvider, EFilterOperators, ELoginType, TLoginParams, TTask, TWebhook } from 'types'

const AppTasksPage = () => {
    const sessions = useSessions()
    const session = sessions?.[0]
    const router = useRouter()
    const [isGitHubProviderModalOpen, setGitHubProviderModalOpen] = useState(false)
    const [isGitLabProviderModalOpen, setGitLabProviderModalOpen] = useState(false)
    const loginMutation = useLogin<TLoginParams>()

    const { data: tasks, isLoading } = useGetList<TTask[], Error>(
        {
            resource: 'tasks',
            params: {
                pagination: {
                    page: 1,
                    perPage: 100
                }
            }
        },
        {
            enabled: !!session
        }
    )

    const { data: githubWebhooks } = useGetList<TWebhook[], Error>(
        {
            resource: 'webhooks',
            params: {
                pagination: {
                    page: 1,
                    perPage: 1
                },
                filter: [
                    {
                        operator: EFilterOperators.Eq,
                        field: 'provider',
                        value: 'github'
                    },
                    {
                        operator: EFilterOperators.Eq,
                        field: 'url',
                        value: `${process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT}/${session?.userId}`
                    }
                ]
            }
        },
        {
            enabled: !!session
        }
    )

    const { data: gitlabWebhooks } = useGetList<TWebhook[], Error>(
        {
            resource: 'webhooks',
            params: {
                pagination: {
                    page: 1,
                    perPage: 1
                },
                filter: [
                    {
                        operator: EFilterOperators.Eq,
                        field: 'provider',
                        value: 'gitlab'
                    },
                    {
                        operator: EFilterOperators.Eq,
                        field: 'url',
                        value: `${process.env.NEXT_PUBLIC_TASKLY_GITLAB_WEBHOOK_ENDPOINT}/${session?.userId}`
                    }
                ]
            }
        },
        {
            enabled: !!session
        }
    )

    const isGitHubConnected = !!githubWebhooks?.length
    const isGitLabConnected = !!gitlabWebhooks?.length

    // TODO connect realtime/subscription

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
            <NextSeo title="My Tasks" />
            <AppPageAppBar title="My Tasks">
                <Row>
                    <Link passHref href="/dashboard">
                        <Text h4>Tasks</Text>
                    </Link>
                </Row>
            </AppPageAppBar>
            <AppPageContainer>
                <Grid xs={12}>
                    <Row css={{ padding: '12px 12px 0 12px' }}>
                        {(!session || typeof githubWebhooks !== 'undefined') && (
                            <Button
                                iconRight={<GithubIcon />}
                                color="primary"
                                ghost
                                onClick={() => {
                                    if (!sessions?.find(item => item.provider === 'github')) {
                                        const redirectUrl = new URL(window.location.toString())
                                        redirectUrl.searchParams.append('manage', 'github')

                                        loginMutation.mutate({
                                            loginType: ELoginType.Provider,
                                            successRedirect: redirectUrl.toString(),
                                            errorRedirect: redirectUrl.toString(),
                                            provider: EAuthProvider.Github,
                                            scopes: ['user:email', 'repo']
                                        })
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
                                iconRight={<GitlabIcon />}
                                color="primary"
                                ghost
                                onClick={() => {
                                    if (!sessions?.find(item => item.provider === 'gitlab')) {
                                        const redirectUrl = new URL(window.location.toString())
                                        redirectUrl.searchParams.append('manage', 'gitlab')

                                        loginMutation.mutate({
                                            loginType: ELoginType.Provider,
                                            successRedirect: redirectUrl.toString(),
                                            errorRedirect: redirectUrl.toString(),
                                            provider: EAuthProvider.Gitlab,
                                            scopes: ['read_user', 'api']
                                        })
                                    } else {
                                        setGitLabProviderModalOpen(true)
                                    }
                                }}
                            >
                                {isGitLabConnected ? 'Manage' : 'Connect'} GitLab
                            </Button>
                        )}
                    </Row>
                    <Table
                        aria-label="My Tasks"
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
                            {tasks?.map(task => (
                                <Table.Row key={task.id}>
                                    <Table.Cell>{task.id}</Table.Cell>
                                    <Table.Cell>{task.title}</Table.Cell>
                                    <Table.Cell>{task.content?.substring(0, 32)}</Table.Cell>
                                    {!!task.link && (
                                        <Table.Cell>
                                            <Link passHref href={task.link}>
                                                <NextUILink target="_blank" title="Open original issue" underline>{`${
                                                    task.provider || 'original'
                                                } issue`}</NextUILink>
                                            </Link>
                                        </Table.Cell>
                                    )}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Grid>
            </AppPageContainer>
            <GitHubProviderModal isOpen={isGitHubProviderModalOpen} onClose={() => setGitHubProviderModalOpen(false)} />
            <GitLabProviderModal isOpen={isGitLabProviderModalOpen} onClose={() => setGitLabProviderModalOpen(false)} />
        </>
    )
}

AppTasksPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppTasksPage
