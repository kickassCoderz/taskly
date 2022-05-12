import { AppLayout, AppPageAppBar, AppPageContainer, TasksEmpty } from 'components'
import { NextSeo } from 'next-seo'

const AppHomePage = () => {
    return (
        <>
            <NextSeo title="Home" />
            <AppPageAppBar title="Home" />
            <AppPageContainer>
                <TasksEmpty />
            </AppPageContainer>
        </>
    )
}

AppHomePage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppHomePage
