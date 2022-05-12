import { TasklyIcon } from 'components/Icons'
import Link from 'next/link'

import { Box } from './Box'

type TLogoProps = {
    href: string
    size?: 'medium' | 'large'
}

const sizes = {
    medium: '115px',
    large: '172px'
}

const Logo = ({ href, size = 'large' }: TLogoProps) => {
    return (
        <Link passHref href={href}>
            <Box
                as="a"
                css={{
                    normalShadow: '$primaryShadow',
                    backgroundColor: 'white',
                    width: sizes[size],
                    display: 'flex',
                    // boxShadow: 'rgb(191, 216, 252) 0px 4px 14px 0px',
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
    )
}

export { Logo }
