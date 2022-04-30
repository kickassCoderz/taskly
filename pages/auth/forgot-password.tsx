import { Container, Text } from '@nextui-org/react'
import { LandingLayout } from 'components'

const ForgotPasswordPage = () => {
    return (
        <Container as="main" fluid display="flex" alignItems="center" justify="center" css={{ flex: '1' }}>
            <Text h1>Hello Forgot pass page</Text>
        </Container>
    )
}

ForgotPasswordPage.getLayout = (page: React.ReactElement) => {
    return <LandingLayout>{page}</LandingLayout>
}

export default ForgotPasswordPage
