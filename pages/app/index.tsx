import { useGetUser } from '@kickass-admin'
import { Row, Text } from '@nextui-org/react'
import { Models } from 'appwrite'
import { AppLayout, AppPageAppBar, AppPageContainer } from 'components'

const AppHomePage = () => {
    const userQuery = useGetUser<Models.User<Models.Preferences>>()

    return (
        <>
            <AppPageAppBar title="Home" />
            <AppPageContainer>
                <Row gap={1}>
                    <Text>saf</Text>
                </Row>
            </AppPageContainer>
        </>
    )
}

AppHomePage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppHomePage
