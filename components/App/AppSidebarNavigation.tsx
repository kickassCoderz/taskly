import { Container, Divider, Grid, Row, Spacer, Text } from '@nextui-org/react'
import { Badge } from 'components/Base'
import { HomeIcon, TaskIcon } from 'components/Icons'
import { memo } from 'react'

import { SidebarNavLink } from './AppSidebarNavLink'

const AppSidebarNavigation = memo(() => {
    return (
        <Container as="nav" fluid responsive={false} gap={0}>
            <Spacer y={0.5} />
            <Row gap={1} align="center" justify="space-between" fluid={false}>
                <Text weight="bold">Workspaces</Text>
                <Spacer x={1} />
                <Badge>Comming soon</Badge>
            </Row>

            <Row gap={1} fluid={false}>
                <Divider y={1} />
            </Row>
            <Grid.Container as="ul" gap={0} css={{ margin: 0 }}>
                <Grid as="li" xs={12}>
                    <SidebarNavLink icon={<HomeIcon size={18} />} label="Home" href="/app" exact />
                </Grid>
                <Grid as="li" xs={12}>
                    <SidebarNavLink icon={<TaskIcon size={18} />} label="My tasks" href="/app/tasks" />
                </Grid>
            </Grid.Container>
            <Row gap={1} fluid={false}>
                <Divider y={1} />
            </Row>
            <Row gap={1} align="center">
                <Text weight="bold">Projects</Text>
                <Spacer x={1} />
                <Badge>Comming soon</Badge>
            </Row>
        </Container>
    )
})

AppSidebarNavigation.displayName = 'AppSidebarNavigation'

export { AppSidebarNavigation }
