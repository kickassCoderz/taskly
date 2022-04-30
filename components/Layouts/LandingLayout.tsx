import { Container } from '@nextui-org/react'
import { LandingFooter, LandingHeader } from 'components/Landing'
import { RemoveMeLogout } from 'components/RemoveMeLogout'

type TLandingLayoutProps = {
    children: JSX.Element
}

const LandingLayout = ({ children }: TLandingLayoutProps) => {
    return (
        <Container fluid responsive={false} gap={0} display="flex" direction="column" css={{ minHeight: '100vh' }}>
            <LandingHeader />
            {children}
            <LandingFooter />
            <RemoveMeLogout />
        </Container>
    )
}

export { LandingLayout }
