import { Container } from '@nextui-org/react'
import { useAppNavigation } from 'hooks'
import React from 'react'

type TAppSidebarProps = {
    children: React.ReactNode
}

const AppSidebar = ({ children }: TAppSidebarProps) => {
    const { isOpen } = useAppNavigation()

    return (
        <Container
            as="aside"
            fluid
            responsive={false}
            gap={0}
            display="flex"
            css={{
                backgroundColor: '$backgroundContrast',
                borderRight: '1px solid $border',
                maxWidth: '20rem',
                flex: '1',
                position: isOpen ? 'absolute' : 'sticky',
                top: 0,
                left: 0,
                height: '100vh',
                transform: isOpen ? 'translateX(-20rem)' : 'translateX(0)'
            }}
        >
            {children}
        </Container>
    )
}

export { AppSidebar }
