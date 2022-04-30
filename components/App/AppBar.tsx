import { Card, Container } from '@nextui-org/react'

type TAppBarProps = {
    sticky?: boolean
    bottomBorder?: boolean
    children: React.ReactNode
}

const AppBar = ({ children, sticky = false, bottomBorder = true }: TAppBarProps) => {
    return (
        <Container
            fluid
            responsive={false}
            gap={0}
            css={{
                height: '$17',
                backgroundColor: '$backgroundContrast',
                padding: '$6',
                ...(sticky && {
                    position: 'sticky',
                    top: 0,
                    left: 0
                }),
                ...(bottomBorder && {
                    borderBottom: '1px solid $border'
                })
            }}
        >
            {children}
        </Container>
    )
}

export { AppBar }
