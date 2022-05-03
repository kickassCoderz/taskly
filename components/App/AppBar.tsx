import { Container } from '@nextui-org/react'

type TAppBarProps = {
    sticky?: boolean
    bottomBorder?: boolean
    children: React.ReactNode
}

const AppBar = ({ children, sticky = false, bottomBorder = true }: TAppBarProps) => {
    return (
        <Container
            as="header"
            display="flex"
            fluid
            responsive={false}
            gap={0}
            css={{
                zIndex: '$max',
                height: '$17',
                backgroundColor: '$backgroundContrast',
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
