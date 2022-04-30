import { Button, Container, Row, Spacer, Switch, SwitchEvent, Text } from '@nextui-org/react'
import { MoonIcon, SunIcon } from 'components/Icons'
import { useTheme } from 'hooks'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const LandingHeader = () => {
    const [isDetached, setIsDetached] = useState(false)
    const { isDark, setTheme } = useTheme()

    useEffect(() => {
        const isBrowser = typeof window !== 'undefined'

        const onScroll = () => {
            setIsDetached(window.scrollY > 0)
        }

        if (isBrowser) {
            setIsDetached(window.scrollY > 0)

            window.addEventListener('scroll', onScroll, { passive: true })
        }
        return () => {
            if (isBrowser) {
                window.removeEventListener('scroll', onScroll)
            }
        }
    }, [])

    const handleThemeChange = useCallback(
        (e: SwitchEvent) => {
            setTheme(e.target.checked ? 'dark' : 'light')
        },
        [setTheme]
    )

    return (
        <Container
            as="header"
            fluid
            responsive={false}
            gap={0}
            css={{
                position: 'sticky',
                top: 0,
                zIndex: '$max',
                backgroundColor: isDetached ? '$landingHeaderBackground' : 'transparent',
                backdropFilter: isDetached ? 'saturate(180%) blur(10px)' : 'none',
                boxShadow: isDetached ? '0px 5px 20px -5px rgba(2, 1, 1, 0.1)' : 'none'
            }}
        >
            <Container fluid>
                <Row fluid justify="center" align="center">
                    <Link passHref href="/">
                        <Text h1 css={{ cursor: 'pointer' }}>
                            Taskly
                        </Text>
                    </Link>

                    <Row fluid justify="flex-end" align="center">
                        <Switch
                            onChange={handleThemeChange}
                            checked={isDark}
                            iconOn={<MoonIcon />}
                            iconOff={<SunIcon />}
                        />
                        <Spacer x={1} />
                        <Link passHref href="/auth/sign-in">
                            <Button as="a" shadow auto ghost>
                                Sign In
                            </Button>
                        </Link>
                        <Spacer x={1} />
                        <Link passHref href="/auth/sign-up">
                            <Button shadow auto>
                                Sign Up
                            </Button>
                        </Link>
                    </Row>
                </Row>
            </Container>
        </Container>
    )
}

export { LandingHeader }
