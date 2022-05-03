import { createResourceBaseQueryKey, EResourceBaseQueryKeyType, ESortOrder, useGetList } from '@kickass-admin'
import { Grid, Link as NextUILink, Row, Table, Text, Tooltip } from '@nextui-org/react'
import {
    AppLayout,
    AppPageAppBar,
    AppPageContainer,
    GithubIcon,
    GitHubProviderModal,
    GitlabIcon,
    GitLabProviderModal,
    ProviderButton,
    TrelloIcon
} from 'components'
import { useAppwrite, useSessions } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { EAuthProvider, TTask } from 'types'

const AppTasksPage = () => {
    const appwrite = useAppwrite()
    const queryClient = useQueryClient()
    const sessions = useSessions()
    const session = sessions?.[0]
    const router = useRouter()
    const [isGitHubProviderModalOpen, setGitHubProviderModalOpen] = useState(false)
    const [isGitLabProviderModalOpen, setGitLabProviderModalOpen] = useState(false)

    const { data: tasks, isLoading } = useGetList<TTask[], Error>(
        {
            resource: 'tasks',
            params: {
                pagination: {
                    page: 1,
                    perPage: 100
                },
                sort: [
                    {
                        field: '$id',
                        order: ESortOrder.Desc
                    }
                ]
            }
        },
        {
            enabled: !!session
        }
    )

    useEffect(() => {
        if (!sessions?.length) {
            return
        }

        // just quick realtime sync through invalidation
        // mostly used for import if user does not focus from tasks screen
        const unsubscribe = appwrite.subscribe('collections.tasks.documents', () => {
            const queryKeysToInvalidate = [
                createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, 'tasks'),
                createResourceBaseQueryKey(EResourceBaseQueryKeyType.One, 'tasks')
            ]

            queryKeysToInvalidate.forEach(queryKey => queryClient.invalidateQueries(queryKey))
        })

        return () => {
            unsubscribe()
        }
    }, [appwrite, queryClient, sessions])

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
                        <ProviderButton
                            iconComponent={GithubIcon}
                            provider={EAuthProvider.Github}
                            label="GitHub"
                            scopes={['user:email', 'repo']}
                            onClick={() => {
                                setGitHubProviderModalOpen(true)
                            }}
                        />
                        <ProviderButton
                            css={{
                                marginLeft: 20
                            }}
                            iconComponent={GitlabIcon}
                            provider={EAuthProvider.Gitlab}
                            label="GitLab"
                            scopes={['read_user', 'api']}
                            onClick={() => {
                                setGitLabProviderModalOpen(true)
                            }}
                        />
                        <Tooltip
                            css={{
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                            color="primary"
                            content="Coming soon"
                            placement="bottom"
                        >
                            <ProviderButton
                                css={{
                                    marginLeft: 20
                                }}
                                iconComponent={TrelloIcon}
                                provider={EAuthProvider.Trello}
                                label="Trello"
                                scopes={[]}
                                disabled
                            />
                        </Tooltip>
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
