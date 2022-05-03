import { useCheckAuth, useLogout } from '@kickass-admin'
import { Button, Container, Loading, Row, Spacer, Switch, SwitchEvent, Text } from '@nextui-org/react'
import { MoonIcon, SunIcon } from 'components/Icons'
import { useTheme } from 'hooks'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const LandingHeader = () => {
    const [isDetached, setIsDetached] = useState(false)
    const { isDark, setTheme } = useTheme()
    const { isAuthenticated } = useCheckAuth()
    const logoutMutation = useLogout()

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

    const handleLogout = useCallback(() => {
        logoutMutation.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logoutMutation.mutate])

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
                            color="secondary"
                            onChange={handleThemeChange}
                            checked={isDark}
                            iconOn={<MoonIcon />}
                            iconOff={<SunIcon />}
                        />
                        <Spacer x={1} />
                        {isAuthenticated ? (
                            <>
                                <Button
                                    color="secondary"
                                    iconRight={logoutMutation.isLoading && <Loading color="currentColor" size="xs" />}
                                    disabled={logoutMutation.isLoading}
                                    shadow
                                    auto
                                    ghost
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </Button>

                                <Spacer x={1} />
                                <Link passHref href="/app">
                                    <Button color="secondary" as="a" shadow auto>
                                        Play with Taskly
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link passHref href="/auth/sign-in">
                                    <Button as="a" shadow auto ghost>
                                        Sign In
                                    </Button>
                                </Link>
                                <Spacer x={1} />
                                <Link passHref href="/auth/sign-up">
                                    <Button as="a" shadow auto>
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Row>
                </Row>
            </Container>
        </Container>
    )
}

export { LandingHeader }
