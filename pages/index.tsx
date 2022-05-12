import { Avatar, Button, Card, Container, Grid, Row, Spacer, Text } from '@nextui-org/react'
import { Box, LandingLayout, LockIcon, MoonIcon, TimeIcon, ZapIcon } from 'components'
import Image from 'next/image'
import Link from 'next/link'

const HomePage = () => {
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
                    <Text h1>Simplify your workflow and get more done.</Text>
                    <Spacer y={0.5} />
                    <Text>All your tasks on one place & more!</Text>
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
                            src="/home-illustration.png"
                            alt="Tasky features"
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
                                Safe & Secure
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                Tasky handles authentication via Appwrite Users API. Users can login with email/password
                                or or any of our 3party providers.
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
                                Because of underlying Appwrite Database API all the data is just miliseconds away from
                                you.
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
                                Realtime UI
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                At Tasky we use Appwrite Realtime to listen for changes, both from webhooks or async
                                import jobs, and update UI accordingly.
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
                                Light & Dark UI
                            </Text>
                        </Row>
                        <Spacer y={1} />
                        <Row>
                            <Text>
                                Tasky comes with both dark and light theme. Our UI automatically changes the theme to
                                your system default.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container
                gap={2}
                css={{
                    padding: '0',
                    backgroundColor: '$landingHeaderBackground',
                    backdropFilter: 'saturate(180%) blur(10px)',
                    borderRadius: '$base',
                    boxShadow: '$md'
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
                            src="/import-tasks.png"
                            alt="Tasky features"
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
                        Developers (especially in open source) often use multiple websites like GitHub and Gitlab to
                        work on their projects and contribute to other.
                    </Text>
                    <Spacer y={0.5} />
                    <Text>
                        There is also a fair share of project management tools that have their own task/todo lists.
                    </Text>
                    <Spacer y={0.5} />
                    <Text>
                        With Taskly all of those are merged into single interface for quick access and management.
                    </Text>
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
