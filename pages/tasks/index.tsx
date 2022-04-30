import { Row, Text } from '@nextui-org/react'
import { AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import Link from 'next/link'

const TasksPage = () => {
    return (
        <>
            <AppPageAppBar>
                <Row>
                    <Link passHref href="/dashboard">
                        <Text h4>Tasks</Text>
                    </Link>
                </Row>
            </AppPageAppBar>
            <AppPageContainer>
                <Text>Hello from tasks page</Text>
            </AppPageContainer>
        </>
    )
}

TasksPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default TasksPage
