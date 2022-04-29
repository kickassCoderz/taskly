import { useLogin } from '@kickass-admin'
import { Button, Col, Container, Row, Switch, Text } from '@nextui-org/react'

import { useTheme } from '../hooks'

const HomePage = () => {
    const { isDark, type, setTheme } = useTheme()

    return (
        <Container fluid>
            <Text h1>Hello from Taskly </Text>
            <Row align="center" gap={0}>
                <Col span={2}>Current theme is :{type}</Col>
                <Col span={2}>
                    <Switch checked={isDark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
                </Col>
            </Row>
            <Button onClick={() => alert('Bome je')}>sale peder</Button>
        </Container>
    )
}

export default HomePage
