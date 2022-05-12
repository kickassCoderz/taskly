import { Avatar, Button, Card, Container, Grid, Row, Spacer, Text } from '@nextui-org/react'
import { Box, LandingLayout, LockIcon, MoonIcon, TimeIcon, ZapIcon } from 'components'
import { useTheme } from 'hooks'
import Image from 'next/image'
import Link from 'next/link'

const HomePage = () => {
    const theme = useTheme()

    return (
        <Container
            as="main"
            fluid
            display="flex"
            alignItems="center"
            justify="center"
            css={{
                zIndex: 2,
                flex: '1'
            }}
        >
            <Spacer y={5} />
            <Grid.Container gap={2} css={{ padding: 0 }}>
                <Grid xs={12} md={5} direction="column" justify="center">
                    <Text h1>Taskly - better way to manage your tasks!</Text>
                    <Spacer y={0.5} />
                    <Text>
                        Taskly is an app to better manage tasks across all of the different task/todo/issue/project
                        applications. Connect all of your 3party task providers and start saving time.{' '}
                        <b>Start below for free</b>.
                    </Text>
                    <Spacer y={2} />
                    <Link passHref href="/auth/sign-up">
                        <Button size="lg" shadow auto color="gradient" css={{ width: 'fit-content' }}>
                            Get Started
                        </Button>
                    </Link>
                </Grid>
                <Grid xs={12} md={7}>
                    <Box css={{ width: '100%', pb: '75%', position: 'relative' }}>
                        <Image
                            src={`/home-illustration${theme.isDark ? '-dark' : ''}.png`}
                            alt="Taskly features"
                            quality={100}
                            layout="fill"
                            objectFit="cover"
                        />
                    </Box>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container gap={2} css={{ padding: 0 }}>
                <Grid xs={12} md={3}>
                    <Card
                        as="article"
                        css={{
                            backgroundColor: '$landingHeaderBackground',
                            backdropFilter: 'saturate(180%) blur(10px)'
                        }}
                    >
                        <Row align="center">
                            <Avatar color="gradient" icon={<LockIcon size={24} />} css={{ color: '$white' }} />
                            <Spacer x={0.5} />
                            <Text weight="bold" size={18}>
                                Safe &amp; Secure
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                Taskly handles authentication via <b>Appwrite Users</b> API. Users can login with email
                                or oAuth2 providers.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} md={3}>
                    <Card
                        as="article"
                        css={{
                            backgroundColor: '$landingHeaderBackground',
                            backdropFilter: 'saturate(180%) blur(10px)'
                        }}
                    >
                        <Row align="center">
                            <Avatar color="gradient" icon={<TimeIcon size={24} />} css={{ color: '$white' }} />
                            <Spacer x={0.5} />
                            <Text weight="bold" size={18}>
                                Fast
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                Because of underlying <b>Appwrite Database</b> API Taskly is incredibly fast and your
                                tasks are miliseconds away.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} md={3}>
                    <Card
                        as="article"
                        css={{
                            backgroundColor: '$landingHeaderBackground',
                            backdropFilter: 'saturate(180%) blur(10px)'
                        }}
                    >
                        <Row align="center">
                            <Avatar color="gradient" icon={<ZapIcon size={24} />} css={{ color: '$white' }} />
                            <Spacer x={0.5} />
                            <Text weight="bold" size={18}>
                                Realtime Sync
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                Taskly uses <b>Appwrite Realtime</b> to listen, sync and manage all of your tasks across
                                different providers while you focus on the job.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} md={3}>
                    <Card
                        as="article"
                        css={{
                            backgroundColor: '$landingHeaderBackground',
                            backdropFilter: 'saturate(180%) blur(10px)'
                        }}
                    >
                        <Row align="center">
                            <Avatar color="gradient" icon={<MoonIcon size={24} />} css={{ color: '$white' }} />
                            <Spacer x={0.5} />
                            <Text weight="bold" size={18}>
                                Light &amp; Dark UI
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                Taskly comes with both dark and light theme. We like the <b>dark</b> but you can choose
                                your own side.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container gap={2}>
                <Grid xs={12} direction="column" justify="center" alignItems="center">
                    <Box
                        css={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            maxWidth: 1024
                        }}
                    >
                        <Text h1>All your tasks in a single app</Text>
                        <Spacer y={1} />
                        <Text h3>
                            When you start using Taskly it will become a central hub for all of your tasks and give you
                            more time to focus on actually doing your job.
                        </Text>
                    </Box>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container
                gap={2}
                css={{
                    padding: '0',
                    backgroundColor: '$landingHeaderBackground',
                    backdropFilter: 'saturate(180%) blur(10px)',
                    borderRadius: '$base'
                }}
            >
                <Grid xs={12} md={7}>
                    <Box
                        css={{
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: '$base',
                            boxShadow: '$md',
                            '@md': {
                                maxWidth: '90%'
                            }
                        }}
                    >
                        <Image
                            src={`/task-module${theme.isDark ? '-dark' : ''}.png`}
                            alt="Taskly features"
                            layout="responsive"
                            width={2488}
                            height={1422}
                            objectFit="cover"
                        />
                    </Box>
                </Grid>
                <Grid xs={12} md={5} direction="column" justify="center">
                    <Text h2>Focus on productivity</Text>
                    <Spacer y={1} />
                    <Text>
                        The core feature of Taskly is Tasks module. It provides a central list of your tasks with search
                        and filtering methods to quickly organise and find tasks that you need to read, edit or
                        (finally) complete.
                    </Text>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container gap={2}>
                <Grid xs={12} direction="column" justify="center" alignItems="center">
                    <Box
                        css={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            maxWidth: 1024
                        }}
                    >
                        <Text h1>Tasks at glance</Text>
                        <Spacer y={1} />
                        <Text h3>
                            Can&apos;t remember the name of the task you were working on last week? <br />
                            No worries, with Taskly you can search and find it in seconds.
                        </Text>
                    </Box>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container
                gap={2}
                css={{
                    backgroundColor: '$landingHeaderBackground',
                    backdropFilter: 'saturate(180%) blur(10px)',
                    borderRadius: '$base',
                    boxShadow: '$md'
                }}
            >
                <Grid xs={12} md={5} direction="column" justify="center">
                    <Text h2>Developer friendly</Text>
                    <Spacer y={1} />
                    <Text>
                        By connecting your repositories all of the issues will be imported and available to manage
                        through Taskly together with your other tasks. We also support Gitlab, Trello and others coming
                        soon. Give as a ping on{' '}
                        <a href="https://github.com/kickassCoderz/taskly" target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                        if you wish to contribute.
                        <Spacer y={1} />
                        Read more about Taskly from our{' '}
                        <a
                            href="https://dev.to/capjavert/taskly-better-way-to-manage-your-tasks-2d2m"
                            target="_blank"
                            rel="noreferrer"
                        >
                            official blog post
                        </a>
                        .
                    </Text>
                </Grid>
                <Grid xs={12} md={7}>
                    <Box
                        css={{
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: '$base',
                            boxShadow: '$md',
                            '@md': {
                                maxWidth: '90%'
                            }
                        }}
                    >
                        <Image
                            src={`/import-tasks${theme.isDark ? '-dark' : ''}.png`}
                            alt="Taskly features"
                            layout="responsive"
                            width={2488}
                            height={1422}
                            objectFit="cover"
                        />
                    </Box>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container gap={2}>
                <Grid xs={12} direction="column" justify="center" alignItems="center">
                    <Box
                        css={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            maxWidth: 1024
                        }}
                    >
                        <Text h1>So, what are you waiting for?</Text>
                        <Spacer y={1} />
                    </Box>
                    <Spacer y={2} />
                    <Link passHref href="/auth/sign-up">
                        <Button size="lg" shadow auto color="gradient" css={{ width: 'fit-content' }}>
                            Get Started NOW!
                        </Button>
                    </Link>
                </Grid>
            </Grid.Container>
            <Spacer y={5} />
        </Container>
    )
}

HomePage.getLayout = (page: React.ReactElement) => {
    return <LandingLayout>{page}</LandingLayout>
}

export default HomePage
