import { Button, Col, Container, Divider, Link as NextUILink, Row, Spacer, Text } from '@nextui-org/react'
import { memo } from 'react'

const AppSidebarNavigation = memo(() => {
    return (
        <Container
            fluid
            responsive={false}
            gap={0}
            css={{
                flex: 1,
                position: 'relative'
            }}
        >
            <Container fluid responsive={false} gap={1} direction="column" css={{ py: '$sm' }}>
                {/* <NextUILink block css={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon />
                    <Spacer x={1} /> Dashboard
                </NextUILink> */}
            </Container>
        </Container>
    )
})

AppSidebarNavigation.displayName = 'AppSidebarNavigation'

export { AppSidebarNavigation }
