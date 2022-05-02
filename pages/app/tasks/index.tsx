import { useGetList } from '@kickass-admin'
import { Grid, Link as NextUILink, Row, Table, Text } from '@nextui-org/react'
import { AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { TTask } from 'types'

const AppTasksPage = () => {
    const { data: tasks, isLoading } = useGetList<TTask[], Error>({
        resource: 'tasks',
        params: {
            pagination: {
                page: 1,
                perPage: 100
            }
        }
    })

    return (
        <>
            <NextSeo title="My Tasks" />
            <AppPageAppBar title="My Tasks">
                <Row>
                    <Link passHref href="/dashboard">
                        <Text h4>Tasks</Text>
                    </Link>
                </Row>
            </AppPageAppBar>
            <AppPageContainer>
                <Grid xs={12}>
                    <Table
                        aria-label="My Tasks"
                        css={{
                            height: 'auto',
                            minWidth: '100%'
                        }}
                    >
                        <Table.Header>
                            <Table.Column>ID</Table.Column>
                            <Table.Column>TITLE</Table.Column>
                            <Table.Column>CONTENT</Table.Column>
                            <Table.Column>LINK</Table.Column>
                        </Table.Header>
                        <Table.Body loadingState={!tasks && isLoading}>
                            {tasks?.map(task => (
                                <Table.Row key={task.id}>
                                    <Table.Cell>{task.id}</Table.Cell>
                                    <Table.Cell>{task.title}</Table.Cell>
                                    <Table.Cell>{task.content?.substring(0, 32)}</Table.Cell>
                                    {!!task.link && (
                                        <Table.Cell>
                                            <Link passHref href={task.link}>
                                                <NextUILink target="_blank" title="Open original issue" underline>{`${
                                                    task.provider || 'original'
                                                } issue`}</NextUILink>
                                            </Link>
                                        </Table.Cell>
                                    )}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Grid>
            </AppPageContainer>
        </>
    )
}

AppTasksPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppTasksPage
