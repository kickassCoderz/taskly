import { Container, Text } from '@nextui-org/react'
import { LandingLayout } from 'components'

const HomePage = () => {
    return (
        <Container as="main" fluid display="flex" alignItems="center" justify="center" css={{ flex: '1' }}>
            <Text h1>Hello landing page</Text>
        </Container>
    )
}

HomePage.getLayout = (page: React.ReactElement) => {
    return <LandingLayout>{page}</LandingLayout>
}

export default HomePage
