import { CheckAuth } from '@kickass-admin'
import { Container, Loading } from '@nextui-org/react'
import { AppSidebar, AppSidebarAppBar, AppSidebarNavigation } from 'components/App'
import { RemoveMeLogout } from 'components/RemoveMeLogout'
import { useRouter } from 'next/router'
import { AppNavigationProvider } from 'providers'
import { useCallback } from 'react'

type TAppLayoutProps = {
    children: JSX.Element
}

const AppLayout = ({ children }: TAppLayoutProps) => {
    const router = useRouter()

    const onAuthCheckSuccess = useCallback(
        (isAuthenticated: boolean) => {
            if (!isAuthenticated) {
                router.replace(`/auth/sign-in?loginRedirect=${encodeURIComponent(router.asPath)}`)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.replace, router.asPath]
    )

    return (
        <CheckAuth
            onAuthCheckSuccess={onAuthCheckSuccess}
            loadingComponent={
                <Container
                    fluid
                    responsive={false}
                    gap={0}
                    display="flex"
                    alignItems="center"
                    justify="center"
                    css={{ height: '100vh' }}
                >
                    <Loading size="xl" />
                </Container>
            }
        >
            <AppNavigationProvider>
                <Container
                    fluid
                    responsive={false}
                    gap={0}
                    display="flex"
                    direction="row"
                    css={{ minHeight: '100vh', position: 'relative' }}
                >
                    <AppSidebar>
                        <AppSidebarAppBar />
                        <AppSidebarNavigation />
                    </AppSidebar>
                    <Container fluid responsive={false} gap={0} css={{ flex: '1' }}>
                        {children}
                    </Container>
                </Container>
            </AppNavigationProvider>
            <RemoveMeLogout />
        </CheckAuth>
    )
}

export { AppLayout }
