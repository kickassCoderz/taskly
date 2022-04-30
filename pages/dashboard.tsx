import { Row, Text } from '@nextui-org/react'
import { AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import Link from 'next/link'

const DashboardPage = () => {
    return (
        <>
            <AppPageAppBar>
                <Row>
                    <Link passHref href="/dashboard">
                        <Text h4>Dashboard</Text>
                    </Link>
                </Row>
            </AppPageAppBar>
            <AppPageContainer>
                <Text>Hello from dashboard page</Text>
            </AppPageContainer>
        </>
    )
}

DashboardPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default DashboardPage
