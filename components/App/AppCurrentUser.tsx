import { useLogout } from '@kickass-admin'
import { Button, Divider, Popover, Row, Spacer, Switch, SwitchEvent, Text, User } from '@nextui-org/react'
import { Badge } from 'components/Base'
import { MoonIcon, SunIcon } from 'components/Icons'
import { useTheme } from 'hooks'
import { useCallback, useMemo } from 'react'
import { createUserAvatarText } from 'utils'

type TAppCurrentUserProps = {
    name?: string
    image?: string
}

const AppCurrentUser = ({ name, image }: TAppCurrentUserProps) => {
    const { isDark, setTheme } = useTheme()
    const logoutMutation = useLogout()

    const avatarFallbackText = useMemo(() => createUserAvatarText(name), [name])

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
        <Popover>
            <Popover.Trigger>
                <User
                    size="md"
                    pointer
                    bordered
                    color="primary"
                    text={avatarFallbackText}
                    name={name}
                    src={image}
                    altText={name}
                    css={{
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'opacity 0.25s ease',
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                />
            </Popover.Trigger>
            <Popover.Content css={{ padding: '$sm' }}>
                <Row align="center" justify="space-between">
                    <Text weight="bold">Preferences</Text>
                    <Spacer x={1} />
                    <Badge>Comming soon</Badge>
                </Row>
                <Spacer y={1} />
                <Row align="center" justify="space-between">
                    <Text small>Dark mode</Text>
                    <Spacer x={1} />
                    <Switch
                        size="xs"
                        onChange={handleThemeChange}
                        checked={isDark}
                        iconOn={<MoonIcon />}
                        iconOff={<SunIcon />}
                    />
                </Row>
                <Divider y={2} />
                <Row align="center" justify="flex-end">
                    <Button
                        disabled={logoutMutation.isLoading}
                        color="primary"
                        auto
                        light
                        size="xs"
                        onClick={handleLogout}
                    >
                        Sign Out
                    </Button>
                </Row>
            </Popover.Content>
        </Popover>
    )
}

export { AppCurrentUser }
