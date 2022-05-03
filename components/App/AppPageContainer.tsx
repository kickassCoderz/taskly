import { Container } from '@nextui-org/react'

type TAppPageContainer = {
    children: React.ReactNode
}

const AppPageContainer = ({ children }: TAppPageContainer) => {
    return (
        <Container as="main" responsive={false} fluid gap={0} css={{ flex: 1 }}>
            {children}
        </Container>
    )
}

export { AppPageContainer }
