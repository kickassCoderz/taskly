import { Button, Row, Text } from '@nextui-org/react'
import { ChevronsLeftIcon } from 'components/Icons'
import { useAppNavigation } from 'hooks'

import { AppBar } from './AppBar'

const AppSidebarAppBar = () => {
    const { toggleNav } = useAppNavigation()

    return (
        <AppBar>
            <Row align="center" justify="space-between">
                <Text h4>Taskly</Text>
                <Button onClick={toggleNav} auto size="sm" light icon={<ChevronsLeftIcon size={24} />} />
            </Row>
        </AppBar>
    )
}

export { AppSidebarAppBar }
