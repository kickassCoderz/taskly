import { Container } from '@nextui-org/react'
import { useAppNavigation } from 'hooks'
import React from 'react'

import { AppSidebarAppBar } from './AppSidebarAppBar'
import { AppSidebarNavigation } from './AppSidebarNavigation'

const AppSidebar = () => {
    const { isOpen, toggleNav } = useAppNavigation()

    console.log(isOpen)

    return (
        <>
            {isOpen && (
                <Container
                    onClick={() => toggleNav()}
                    role="button"
                    aria-hidden="true"
                    fluid
                    responsive={false}
                    gap={0}
                    css={{
                        zIndex: 10999,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'saturate(180%) blur(10px)',
                        '@md': {
                            display: 'none'
                        }
                    }}
                />
            )}
            <Container
                as="aside"
                fluid
                responsive={false}
                gap={0}
                css={{
                    zIndex: 11000,
                    backgroundColor: '$backgroundContrast',
                    borderRight: '1px solid $border',
                    maxWidth: '18rem',
                    flex: '1',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    boxShadow: isOpen ? '$md' : 'none',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-18rem)',

                    '@md': {
                        boxShadow: 'none',
                        position: isOpen ? 'sticky' : 'absolute'
                    }
                }}
            >
                <AppSidebarAppBar />
                <AppSidebarNavigation />
            </Container>
        </>
    )
}

export { AppSidebar }
