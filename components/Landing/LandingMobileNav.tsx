import { useCheckAuth, useLogout } from '@kickass-admin'
import { Button, Divider, Loading, Row, Spacer, Switch, SwitchEvent, Text } from '@nextui-org/react'
import { Box } from 'components/Base'
import { ChevronsLeftIcon, MoonIcon, SunIcon, TasklyIcon } from 'components/Icons'
import { useAppNavigation, useTheme } from 'hooks'
import Link from 'next/link'
import { useCallback } from 'react'

const LandingMobileNav = () => {
    const { isOpen, toggleNav } = useAppNavigation()
    const { isAuthenticated } = useCheckAuth()
    const logoutMutation = useLogout()
    const { isDark, setTheme } = useTheme()

    const handleLogout = useCallback(() => {
        toggleNav()
        logoutMutation.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logoutMutation.mutate, toggleNav])

    const handleToggleNav = useCallback(() => toggleNav(), [toggleNav])

    const handleThemeChange = useCallback(
        (e: SwitchEvent) => {
            setTheme(e.target.checked ? 'dark' : 'light')
        },
        [setTheme]
    )

    return (
        <>
            {isOpen && (
                <Box
                    onClick={handleToggleNav}
                    css={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10000,
                        backgroundColor: '$landingHeaderBackground',
                        backdropFilter: 'saturate(180%) blur(10px)'
                    }}
                />
            )}
            <Box
                css={{
                    boxShadow: isOpen ? '$md' : 'none',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-18rem)',
                    backgroundColor: '$backgroundContrast',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    maxWidth: '18rem',
                    height: '100%',
                    zIndex: 11000,
                    py: '$8',
                    px: '$10'
                }}
            >
                <Row justify="space-between">
                    <Link href="/" passHref>
                        <Box
                            onClick={handleToggleNav}
                            as="a"
                            css={{
                                all: 'unset',
                                normalShadow: '$primaryShadow',
                                backgroundColor: 'white',
                                width: 115,
                                display: 'flex',
                                color: '$primary',

                                borderRadius: '$squared',

                                '& svg': {
                                    width: '100%',
                                    height: '100%'
                                }
                            }}
                        >
                            <TasklyIcon />
                        </Box>
                    </Link>
                    <Button
                        onClick={handleToggleNav}
                        icon={<ChevronsLeftIcon size={24} />}
                        auto
                        size="sm"
                        light
                        css={{ padding: 0, width: '32px' }}
                    />
                </Row>
                <Divider y={1} />
                {isAuthenticated ? (
                    <>
                        <Button
                            iconRight={logoutMutation.isLoading && <Loading color="currentColor" size="xs" />}
                            disabled={logoutMutation.isLoading}
                            auto
                            color="gradient"
                            onClick={handleLogout}
                        >
                            Sign Out
                        </Button>

                        <Spacer x={1} />
                        <Link passHref href="/app/tasks">
                            <Button as="a" auto color="gradient" onClick={handleToggleNav}>
                                Play with Taskly
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link passHref href="/auth/sign-in">
                            <Button as="a" auto color="gradient" onClick={handleToggleNav}>
                                Sign In
                            </Button>
                        </Link>
                        <Spacer x={1} />
                        <Link passHref href="/auth/sign-up">
                            <Button as="a" auto color="gradient" onClick={handleToggleNav}>
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
                <Divider y={1} />
                <Row align="center">
                    <Switch onChange={handleThemeChange} checked={isDark} iconOn={<MoonIcon />} iconOff={<SunIcon />} />
                    <Spacer x={1} />
                    <Text>{isDark ? 'Dark theme' : 'Light theme'}</Text>
                </Row>
            </Box>
        </>
    )
}

export { LandingMobileNav }
