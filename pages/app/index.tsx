import { Grid, Spacer, Text, Tooltip } from '@nextui-org/react'
import {
    AppLayout,
    AppPageAppBar,
    AppPageContainer,
    GithubIcon,
    GitlabIcon,
    ProviderButton,
    TasksIlustration,
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
                <Grid.Container gap={7}>
                    <Grid xs={12} alignItems="center" justify="center">
                        <TasksIlustration />
                    </Grid>
                    <Grid xs={12} direction="column" alignItems="center" justify="center">
                        <Text h2>Ready to kick some of your tasks?</Text>
                        <Text size={24}>Start by connecting some of your services</Text>
                    </Grid>
                    <Grid xs={12} alignItems="center" justify="center">
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
                    </Grid>
                </Grid.Container>
            </AppPageContainer>
        </>
    )
}

AppHomePage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppHomePage
