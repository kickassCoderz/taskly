import { Container } from '@nextui-org/react'
import { useAppNavigation } from 'hooks'
import React from 'react'

import { AppSidebarAppBar } from './AppSidebarAppBar'
import { AppSidebarNavigation } from './AppSidebarNavigation'

const AppSidebar = () => {
    const { isOpen } = useAppNavigation()

    return (
        <Container
            as="aside"
            fluid
            responsive={false}
            gap={0}
            css={{
                backgroundColor: '$backgroundContrast',
                borderRight: '1px solid $border',
                maxWidth: '18rem',
                flex: '1',
                position: isOpen ? 'absolute' : 'sticky',
                top: 0,
                left: 0,
                height: '100vh',
                transform: isOpen ? 'translateX(-18rem)' : 'translateX(0)'
            }}
        >
            <AppSidebarAppBar />
            <AppSidebarNavigation />
        </Container>
    )
}

export { AppSidebar }
