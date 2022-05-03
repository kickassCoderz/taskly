import { useGetOne } from '@kickass-admin'
import { Col, Row } from '@nextui-org/react'
import { AppFeatureBar, AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import { useSessions } from 'hooks'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { TTask } from 'types'

const AppTaskPage = () => {
    const session = useSessions()?.[0]
    const router = useRouter()
    const taskId = router.query.id as string

    const { data: task } = useGetOne<TTask, Error>(
        {
            resource: 'tasks',
            params: {
                id: taskId
            }
        },
        {
            enabled: !!session && !!taskId
        }
    )

    const pageTitle = `Task ${task?.title ? `"${task.title}"` : `#${taskId}`}`

    return (
        <>
            <NextSeo title={pageTitle} />
            <AppPageAppBar title={pageTitle} />
            <AppFeatureBar>
                <Row gap={1} align="center" justify="center">
                    <Col css={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div>palceholder left</div>
                    </Col>
                    <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div>palceholder right</div>
                    </Col>
                </Row>
            </AppFeatureBar>
            <AppPageContainer>
                <div>content</div>
            </AppPageContainer>
        </>
    )
}

AppTaskPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppTaskPage
