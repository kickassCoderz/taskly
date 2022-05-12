import { Container } from '@nextui-org/react'

type TAppFeatureBarProps = {
    children: React.ReactNode
}

const AppFeatureBar = ({ children }: TAppFeatureBarProps) => {
    return (
        <Container
            fluid
            gap={0}
            responsive={false}
            display="flex"
            css={{
                py: '$3',
                position: 'sticky',
                top: '$17',
                backgroundColor: '$backgroundContrast',
                borderBottom: '1px solid $border',
                zIndex: '$max'
            }}
        >
            {children}
        </Container>
    )
}

export { AppFeatureBar }
