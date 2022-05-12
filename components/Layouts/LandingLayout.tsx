import { Container } from '@nextui-org/react'
import { LandingFooter, LandingHeader } from 'components/Landing'

type TLandingLayoutProps = {
    children: JSX.Element
}

const LandingLayout = ({ children }: TLandingLayoutProps) => {
    return (
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
    )
}

export { LandingLayout }
