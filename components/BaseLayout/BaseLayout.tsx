import { Container } from '@nextui-org/react'

type TBaseLayoutProps = {
    children: JSX.Element
}

const BaseLayout = ({ children }: TBaseLayoutProps) => {
    return (
        <Container fluid responsive={false} gap={0} display="flex" direction="column" css={{ minHeight: '100vh' }}>
            {children}
        </Container>
    )
}

export { BaseLayout }
