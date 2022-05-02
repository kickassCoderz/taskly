import { Grid, Row, Table, Text } from '@nextui-org/react'
import { AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

const AppTasksPage = () => {
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
                <Grid.Container gap={2}>
                    <Grid xs={12}>
                        <Table
                            containerCss={{
                                width: '100%'
                            }}
                            aria-label="Example table with static content"
                        >
                            <Table.Header>
                                <Table.Column>NAME</Table.Column>
                                <Table.Column>ROLE</Table.Column>
                                <Table.Column>STATUS</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row key="1">
                                    <Table.Cell>Tony Reichert</Table.Cell>
                                    <Table.Cell>CEO</Table.Cell>
                                    <Table.Cell>Active</Table.Cell>
                                </Table.Row>
                                <Table.Row key="2">
                                    <Table.Cell>Zoey Lang</Table.Cell>
                                    <Table.Cell>Technical Lead</Table.Cell>
                                    <Table.Cell>Paused</Table.Cell>
                                </Table.Row>
                                <Table.Row key="3">
                                    <Table.Cell>Jane Fisher</Table.Cell>
                                    <Table.Cell>Senior Developer</Table.Cell>
                                    <Table.Cell>Active</Table.Cell>
                                </Table.Row>
                                <Table.Row key="4">
                                    <Table.Cell>William Howard</Table.Cell>
                                    <Table.Cell>Community Manager</Table.Cell>
                                    <Table.Cell>Vacation</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid>
                </Grid.Container>
            </AppPageContainer>
        </>
    )
}

AppTasksPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppTasksPage
