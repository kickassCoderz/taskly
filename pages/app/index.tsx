import { Container, Row, Text, Tooltip } from '@nextui-org/react'
import {
    AppLayout,
    AppPageAppBar,
    AppPageContainer,
    GithubIcon,
    GitlabIcon,
    ProviderButton,
    TrelloIcon
} from 'components'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { EAuthProvider } from 'types'

const AppHomePage = () => {
    const router = useRouter()

    return (
        <>
            <NextSeo title="Home" />
            <AppPageAppBar title="Home" />
            <AppPageContainer>
                <Container
                    css={{
                        display: 'flex',
                        flex: 1,
                        height: '100vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Text h2>Ready to kick some of your tasks?</Text>
                    <Text
                        css={{
                            marginTop: 10
                        }}
                        h4
                    >
                        Start by connecting some of your services
                    </Text>
                    <Row
                        css={{
                            marginTop: 40
                        }}
                        justify="center"
                    >
                        <ProviderButton
                            css={{
                                marginLeft: 20
                            }}
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
                        <ProviderButton
                            css={{
                                marginLeft: 20
                            }}
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
                </Container>
            </AppPageContainer>
        </>
    )
}

AppHomePage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppHomePage
