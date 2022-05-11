import {
    createResourceBaseQueryKey,
    EResourceBaseQueryKeyType,
    ESortOrder,
    useDeleteOne,
    useGetList,
    useRealtimeSubscription
} from '@kickass-admin'
import {
    Button,
    Col,
    Grid,
    Input,
    Link as NextUILink,
    Popover,
    Row,
    Spacer,
    Table,
    Text,
    Tooltip
} from '@nextui-org/react'
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
    TrashIcon,
    TrelloIcon
} from 'components'
import { useSessions } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useQueryClient } from 'react-query'
import { ESubscriptionEventTypes, TRealtimeParams } from 'services'
import { EAuthProvider, EFilterOperators, TTask } from 'types'

const allowMarkdownElement = () => false

const defaultSort = {
    field: '$id',
    order: ESortOrder.Desc
}

const statusColorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning'> = {
    open: 'success',
    opened: 'success',
    closed: 'error'
}

const statusTextMap: Record<string, string> = {
    opened: 'open'
}

const AppTasksPage = () => {
    const queryClient = useQueryClient()
    const sessions = useSessions()
    const session = sessions?.[0]
    const router = useRouter()
    const [isGitHubProviderModalOpen, setGitHubProviderModalOpen] = useState(false)
    const [isGitLabProviderModalOpen, setGitLabProviderModalOpen] = useState(false)
    const [isImportPopperOpen, setIsImportPopperOpen] = useState(false)
    const { field = defaultSort.field, order = defaultSort.order, search = '', status } = router.query

    const deleteMutation = useDeleteOne()

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

    const setQueryState = useCallback(
        (values: Record<string, string>) => {
            router.replace(
                {
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        ...values
                    }
                },
                undefined,
                {
                    shallow: true
                }
            )
        },
        [router]
    )

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
                        field: field as string,
                        order: order as ESortOrder
                    }
                ],
                filter: [
                    {
                        operator: EFilterOperators.Contains,
                        field: 'title',
                        value: search
                    },
                    {
                        operator: EFilterOperators.Eq,
                        field: 'status',
                        value: status === 'open' ? ['open', 'opened'] : (status as string)
                    }
                ].filter(item => !!item.value)
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
                            fullWidth
                            value={search}
                            onChange={event => {
                                setQueryState({
                                    search: event.target.value || ''
                                })
                            }}
                        />
                    </Col>
                    <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link passHref href="/app/tasks/create">
                            <NextUILink>
                                <Button href="/app/tasks/create" auto size="xs" color="gradient">
                                    Create new task
                                </Button>
                            </NextUILink>
                        </Link>
                        <Spacer x={0.5} />
                        <Button
                            auto
                            flat
                            size="xs"
                            icon={<FilterIcon size={12} />}
                            color={statusColorMap[status as string] || 'default'}
                            onClick={() => {
                                const nextStatus = {
                                    open: 'closed',
                                    closed: '',
                                    undefined: 'open'
                                }[status as string]

                                if (typeof nextStatus === 'undefined') {
                                    setQueryState({
                                        status: 'open'
                                    })
                                } else {
                                    setQueryState({
                                        status: nextStatus
                                    })
                                }
                            }}
                        >
                            Status
                            {!!status && (
                                <Text
                                    as="span"
                                    color="currentColor"
                                    css={{
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    :&nbsp;
                                    {status}
                                </Text>
                            )}
                        </Button>
                        <Spacer x={0.5} />
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
                <Table
                    aria-label="My Tasks"
                    shadow={false}
                    sortDescriptor={{
                        column: field as string,
                        direction: order === ESortOrder.Asc ? 'ascending' : 'descending'
                    }}
                    onSortChange={value => {
                        if (!value.column || !value.direction) {
                            setQueryState({
                                ...defaultSort
                            })
                        } else {
                            setQueryState({
                                field: value.column.toString(),
                                order: value.direction === 'ascending' ? ESortOrder.Asc : ESortOrder.Desc
                            })
                        }
                    }}
                >
                    <Table.Header>
                        <Table.Column key="title" allowsSorting>
                            TITLE
                        </Table.Column>
                        <Table.Column>DESCRIPTION</Table.Column>
                        <Table.Column key="$id" allowsSorting>
                            ID
                        </Table.Column>
                        <Table.Column key="status" allowsSorting>
                            STATUS
                        </Table.Column>
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
                                        <ReactMarkdown skipHtml allowElement={allowMarkdownElement} unwrapDisallowed>
                                            {task.content}
                                        </ReactMarkdown>
                                    </Text>
                                </Table.Cell>
                                <Table.Cell>{task.id}</Table.Cell>
                                <Table.Cell>
                                    <Badge color={statusColorMap[task.status] || 'default'}>
                                        {statusTextMap[task.status] || task.status}
                                    </Badge>
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
                                                    onClick={() => {
                                                        router.push({
                                                            pathname: `/app/tasks/${task.id}`
                                                        })
                                                    }}
                                                />
                                            </Tooltip>
                                        </Col>
                                        <Col css={{ d: 'flex' }}>
                                            <Tooltip
                                                css={{ whiteSpace: 'nowrap' }}
                                                content="Delete task"
                                                color="error"
                                                onClick={() => {
                                                    if (deleteMutation.isLoading) {
                                                        return
                                                    }

                                                    deleteMutation.mutate({
                                                        resource: 'tasks',
                                                        params: {
                                                            id: task.id
                                                        }
                                                    })
                                                }}
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
