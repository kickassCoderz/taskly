import { Spacer, Text, Tooltip } from '@nextui-org/react'
import { Box, GithubIcon, GitlabIcon, ProviderButton, TasksIlustration, TrelloIcon } from 'components'
import { useRouter } from 'next/router'
import { EAuthProvider } from 'types'

const TasksEmpty = () => {
    const router = useRouter()

    return (
        <Box
            css={{
                p: '$lg',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <TasksIlustration />
            <Spacer y={2} />
            <Text h2 css={{ textAlign: 'center' }}>
                Ready to kick some of your tasks?
            </Text>
            <Text size={24} css={{ textAlign: 'center' }}>
                Start by connecting some of your services
            </Text>
            <Spacer y={2} />
            <Box
                css={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',

                    '@xs': {
                        flexDirection: 'row'
                    }
                }}
            >
                <ProviderButton
                    iconComponent={GithubIcon}
                    provider={EAuthProvider.Github}
                    label="GitHub"
                    scopes={['user:email', 'repo']}
                    redirectPath="/app/tasks"
                    onClick={() => {
                        router.push({
                            pathname: '/app/tasks',
                            query: {
                                manage: 'github'
                            }
                        })
                    }}
                />
                <Spacer x={1} />
                <ProviderButton
                    iconComponent={GitlabIcon}
                    provider={EAuthProvider.Gitlab}
                    label="GitLab"
                    scopes={['read_user', 'api']}
                    redirectPath="/app/tasks"
                    onClick={() => {
                        router.push({
                            pathname: '/app/tasks',
                            query: {
                                manage: 'gitlab'
                            }
                        })
                    }}
                />
                <Spacer x={1} />
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
                        iconComponent={TrelloIcon}
                        provider={EAuthProvider.Trello}
                        label="Trello"
                        scopes={[]}
                        disabled
                    />
                </Tooltip>
            </Box>
        </Box>
    )
}

export { TasksEmpty }
