import { Container } from '@nextui-org/react'

type TAppPageContainer = {
    children: React.ReactNode
}

const AppPageContainer = ({ children }: TAppPageContainer) => {
    return (
        <Container as="main" fluid gap={1} css={{ py: '$sm' }}>
            {children}
        </Container>
    )
}

export { AppPageContainer }
