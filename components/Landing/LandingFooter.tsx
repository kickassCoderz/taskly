import { Container, Link as NextUILink, Row, Spacer, Text } from '@nextui-org/react'
import Link from 'next/link'

const LandingFooter = () => {
    return (
        <Container as="footer" fluid responsive={false} gap={0} css={{ py: '$5' }}>
            <Container fluid>
                <Row align="center" justify="center">
                    <NextUILink
                        css={{ fontSize: '$tiny' }}
                        href="https://github.com/kickassCoderz"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        &copy;KickassCoderz
                    </NextUILink>
                    &nbsp;
                    <Text size={12}>{new Date().getFullYear()}</Text>
                </Row>
                <Row align="center" justify="center">
                    <Text size={12}>Crafted with</Text>
                    &nbsp;
                    <NextUILink
                        css={{ fontSize: '$tiny' }}
                        href="https://appwrite.io/"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Appwrite
                    </NextUILink>
                    &nbsp;
                    <Text size={12}>and</Text>
                    &nbsp;
                    <NextUILink
                        css={{ fontSize: '$tiny' }}
                        href="https://nextui.org/"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        NextUI
                    </NextUILink>
                    &nbsp;
                    <Text small>❤️</Text>
                </Row>
            </Container>
        </Container>
    )
}

export { LandingFooter }
