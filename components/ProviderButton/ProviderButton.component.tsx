import { useGetList, useLogin } from '@kickass-admin'
import { Button, ButtonProps } from '@nextui-org/react'
import { useSessions } from 'hooks'
import { ElementType, FC, MouseEventHandler, useMemo } from 'react'
import { EAuthProvider, EFilterOperators, ELoginType, TLoginParams, TWebhook } from 'types'

const WEBHOOKS = {
    [EAuthProvider.Github]: process.env.NEXT_PUBLIC_TASKLY_GITHUB_WEBHOOK_ENDPOINT,
    [EAuthProvider.Gitlab]: process.env.NEXT_PUBLIC_TASKLY_GITLAB_WEBHOOK_ENDPOINT,
    [EAuthProvider.Trello]: process.env.NEXT_PUBLIC_TASKLY_TRELLO_WEBHOOK_ENDPOINT
}

const ProviderButton: FC<
    {
        iconComponent: ElementType
        provider: EAuthProvider
        label?: string
        labelOverride?: string
        scopes: string[]
        onClick?: MouseEventHandler<HTMLButtonElement>
        redirectPath?: string
    } & ButtonProps
> = ({ iconComponent: Icon, provider, label = provider, scopes, onClick, redirectPath, labelOverride, ...rest }) => {
    const sessions = useSessions()
    const session = sessions?.[0]
    const loginMutation = useLogin<TLoginParams>()

    const { data: webhooks } = useGetList<TWebhook[], Error>(
        {
            resource: 'webhooks',
            params: {
                pagination: {
                    page: 1,
                    perPage: 1
                },
                filter: [
                    {
                        operator: EFilterOperators.Eq,
                        field: 'provider',
                        value: provider
                    },
                    {
                        operator: EFilterOperators.Eq,
                        field: 'url',
                        value: `${WEBHOOKS[provider]}/${session?.userId}`
                    }
                ]
            }
        },
        {
            enabled: !!session && !rest.disabled
        }
    )

    const isConnected = !!webhooks?.length

    const resolvedLabel = useMemo(() => {
        if (labelOverride) {
            return labelOverride
        }

        return `${isConnected ? 'Manage' : 'Connect'} ${label}`
    }, [isConnected, label, labelOverride])

    return (
        <Button
            auto
            flat
            size="xs"
            iconRight={<Icon size={12} />}
            disabled={!session}
            color="primary"
            onClick={event => {
                if (!sessions?.find(item => item.provider === provider)) {
                    const redirectUrl = new URL(window.location.toString())
                    redirectUrl.searchParams.append('manage', provider)

                    if (redirectPath) {
                        redirectUrl.pathname = redirectPath
                    }

                    loginMutation.mutate({
                        loginType: ELoginType.Provider,
                        successRedirect: redirectUrl.toString(),
                        errorRedirect: redirectUrl.toString(),
                        provider: provider,
                        scopes
                    })
                } else if (typeof onClick === 'function') {
                    onClick(event)
                }
            }}
            {...rest}
        >
            {resolvedLabel}
        </Button>
    )
}

export default ProviderButton
