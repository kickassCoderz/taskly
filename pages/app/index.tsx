import { Row, Text } from '@nextui-org/react'
import { AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import Link from 'next/link'

const AppHomePage = () => {
    return (
        <>
            <AppPageAppBar>
                <Row>
                    <Link passHref href="/dashboard">
                        <Text h4>Home</Text>
                    </Link>
                </Row>
            </AppPageAppBar>
            <AppPageContainer>
                <Text>Hello from App home page</Text>
            </AppPageContainer>
        </>
    )
}

AppHomePage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppHomePage
