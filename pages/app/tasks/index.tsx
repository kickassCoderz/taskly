import {
    createResourceBaseQueryKey,
    EResourceBaseQueryKeyType,
    ESortOrder,
    useGetList,
    useRealtimeSubscription
} from '@kickass-admin'
import { Button, Col, Grid, Input, Popover, Row, Spacer, Table, Text, Tooltip } from '@nextui-org/react'
import {
    AppFeatureBar,
    AppLayout,
    AppPageAppBar,
    AppPageContainer,
    Badge,
    EditIcon,
    FilterIcon,
    GithubIcon,
    GitHubProviderModal,
    GitlabIcon,
    GitLabProviderModal,
    ImportIcon,
    LinkIcon,
    ProviderButton,
    SearchIcon,
    SortIcon,
    TrashIcon,
    TrelloIcon
} from 'components'
import { useSessions } from 'hooks'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { ESubscriptionEventTypes, TRealtimeParams } from 'services'
import { EAuthProvider, TTask } from 'types'

const AppTasksPage = () => {
    const queryClient = useQueryClient()
    const sessions = useSessions()
    const session = sessions?.[0]
    const router = useRouter()
    const [isGitHubProviderModalOpen, setGitHubProviderModalOpen] = useState(false)
    const [isGitLabProviderModalOpen, setGitLabProviderModalOpen] = useState(false)
    const [isImportPopperOpen, setIsImportPopperOpen] = useState(false)

    useRealtimeSubscription<TRealtimeParams<TTask>>({
        enabled: !!session,
        channel: 'tasks',
        eventTypes: [ESubscriptionEventTypes.Create, ESubscriptionEventTypes.Delete, ESubscriptionEventTypes.Update],
        onChange: useCallback(() => {
            const queryKeysToInvalidate = [
                createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, 'tasks'),
                createResourceBaseQueryKey(EResourceBaseQueryKeyType.One, 'tasks')
            ]

            queryKeysToInvalidate.forEach(queryKey => queryClient.invalidateQueries(queryKey))
        }, [queryClient])
    })

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
            enabled: !!session,
            staleTime: Infinity
        }
    )

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
            <AppPageAppBar title="My Tasks" />
            <AppFeatureBar>
                <Row gap={1} align="center" justify="center">
                    <Col css={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Input
                            aria-label="Search"
                            contentLeft={<SearchIcon size={16} />}
                            size="xs"
                            placeholder="Search"
                        />
                    </Col>
                    <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button auto flat size="xs" icon={<FilterIcon size={12} />}>
                            Filter
                        </Button>
                        <Spacer x={0.5} />
                        <Button auto flat size="xs" icon={<SortIcon size={12} />}>
                            Sort
                        </Button>
                        <Spacer x={0.5} />
                        <Popover isOpen={isImportPopperOpen} onOpenChange={setIsImportPopperOpen}>
                            <Popover.Trigger>
                                <Button auto flat size="xs" icon={<ImportIcon size={12} />}>
                                    Connect
                                </Button>
                            </Popover.Trigger>
                            <Popover.Content css={{ padding: '$xs' }}>
                                <Grid.Container gap={2} direction="column">
                                    <Grid xs={12} alignItems="center" justify="space-between">
                                        <Text small>Github</Text>
                                        <Spacer x={0.5} />
                                        <ProviderButton
                                            iconComponent={GithubIcon}
                                            provider={EAuthProvider.Github}
                                            label="GitHub"
                                            scopes={['user:email', 'repo']}
                                            onClick={() => {
                                                setIsImportPopperOpen(false)
                                                setGitHubProviderModalOpen(true)
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={12} alignItems="center" justify="space-between">
                                        <Text small>Gitlab</Text>
                                        <Spacer x={0.5} />
                                        <ProviderButton
                                            iconComponent={GitlabIcon}
                                            provider={EAuthProvider.Gitlab}
                                            label="GitLab"
                                            scopes={['read_user', 'api']}
                                            onClick={() => {
                                                setIsImportPopperOpen(false)
                                                setGitLabProviderModalOpen(true)
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={12} alignItems="center" justify="space-between">
                                        <Text small>Trello</Text>
                                        <Spacer x={0.5} />
                                        <ProviderButton
                                            css={{
                                                marginLeft: 20
                                            }}
                                            iconComponent={TrelloIcon}
                                            provider={EAuthProvider.Trello}
                                            labelOverride="Comming soon"
                                            scopes={[]}
                                            disabled
                                        />
                                    </Grid>
                                </Grid.Container>
                            </Popover.Content>
                        </Popover>
                    </Col>
                </Row>
            </AppFeatureBar>
            <AppPageContainer>
                <Table aria-label="My Tasks" shadow={false}>
                    <Table.Header>
                        <Table.Column>TITLE</Table.Column>
                        <Table.Column>DESCRIPTION</Table.Column>
                        <Table.Column>ID</Table.Column>
                        <Table.Column>STATUS</Table.Column>
                        <Table.Column hideHeader>ACTIONS</Table.Column>
                    </Table.Header>
                    <Table.Body loadingState={!tasks && isLoading}>
                        {tasks?.map(task => (
                            <Table.Row key={task.id}>
                                <Table.Cell>
                                    <Text weight="semibold">{task.title}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text
                                        css={{
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            width: '100%',
                                            maxWidth: '$60'
                                        }}
                                    >
                                        {task.content}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell>{task.id}</Table.Cell>
                                <Table.Cell>
                                    <Badge color={task.status === 'open' ? 'success' : 'error'}>{task.status}</Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Row justify="center" align="center">
                                        {task?.link && (
                                            <Col css={{ d: 'flex' }}>
                                                <Tooltip content="Issue url">
                                                    <Button
                                                        as="a"
                                                        href={task.link}
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                        auto
                                                        light
                                                        size="xs"
                                                        icon={<LinkIcon size={20} />}
                                                    />
                                                </Tooltip>
                                            </Col>
                                        )}
                                        <Col css={{ d: 'flex' }}>
                                            <Tooltip color="primary" content="Edit task">
                                                <Button
                                                    auto
                                                    light
                                                    color="primary"
                                                    size="xs"
                                                    icon={<EditIcon size={20} />}
                                                    onClick={() => alert(`Edit task ${task.id}`)}
                                                />
                                            </Tooltip>
                                        </Col>
                                        <Col css={{ d: 'flex' }}>
                                            <Tooltip
                                                css={{ whiteSpace: 'nowrap' }}
                                                content="Delete task"
                                                color="error"
                                                onClick={() => alert(`Delete task ${task.id}`)}
                                            >
                                                <Button
                                                    auto
                                                    light
                                                    size="xs"
                                                    color="error"
                                                    icon={<TrashIcon size={20} />}
                                                />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
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
