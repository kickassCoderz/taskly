import { Button, Row } from '@nextui-org/react'
import { ChevronsRightIcon } from 'components/Icons'
import { useAppNavigation } from 'hooks'
import React from 'react'

import { AppBar } from './AppBar'

type TAppPageAppBarProps = {
    children: React.ReactNode
}

const AppPageAppBar = ({ children }: TAppPageAppBarProps) => {
    const { isOpen, toggleNav } = useAppNavigation()

    return (
        <AppBar sticky>
            <Row align="center" justify="center">
                {isOpen && <Button onClick={toggleNav} auto size="sm" light icon={<ChevronsRightIcon size={24} />} />}
                {children}
            </Row>
        </AppBar>
    )
}

export { AppPageAppBar }
