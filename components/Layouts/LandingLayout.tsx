import { Container } from '@nextui-org/react'
import { LandingFooter, LandingHeader, LandingMobileNav } from 'components/Landing'
import { AppNavigationProvider } from 'providers'

type TLandingLayoutProps = {
    children: JSX.Element
}

const LandingLayout = ({ children }: TLandingLayoutProps) => {
    return (
        <AppNavigationProvider>
            <LandingMobileNav />
            <Container
                fluid
                responsive={false}
                gap={0}
                display="flex"
                direction="column"
                css={{
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                <LandingHeader />
                {children}
                <LandingFooter />
            </Container>
        </AppNavigationProvider>
    )
}

export { LandingLayout }
