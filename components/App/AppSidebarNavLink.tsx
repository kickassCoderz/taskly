import { Button, NormalColors } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { pathToRegexp } from 'path-to-regexp'
import { useMemo } from 'react'

type TSidebarNavLink = {
    icon: JSX.Element
    href: string
    hrefAs?: string
    label: string
    exact?: boolean
    color?: NormalColors
}

const SidebarNavLink = ({ icon: Icon, href, hrefAs, label, exact = false, color = 'primary' }: TSidebarNavLink) => {
    const { asPath } = useRouter()

    const isActive = useMemo(
        () => pathToRegexp(hrefAs || href, [], { sensitive: true, end: !!exact }).test(asPath),
        [hrefAs, href, asPath, exact]
    )

    return (
        <Link passHref href={href}>
            <Button
                flat={isActive}
                light={!isActive}
                auto
                as="a"
                icon={Icon}
                color={color}
                css={{
                    borderRadius: 0,
                    width: '100%',
                    justifyContent: 'flex-start',
                    color: isActive ? `$${color}` : '$text',
                    fontWeight: isActive ? '$bold' : '$medium',

                    '&::before': {
                        position: 'absolute',
                        content: "''",
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: 4,
                        borderTopRightRadius: '$sm',
                        borderBottomRightRadius: '$sm',
                        backgroundColor: isActive ? `$${color}` : 'transparent'
                    },
                    '&:hover': {
                        backgroundColor: `$${color}Light`
                    }
                }}
            >
                {label}
            </Button>
        </Link>
    )
}

export { SidebarNavLink }
