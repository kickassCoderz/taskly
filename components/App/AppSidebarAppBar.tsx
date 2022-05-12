import { Button, Col, Row } from '@nextui-org/react'
import { Logo } from 'components/Base'
import { ChevronsLeftIcon } from 'components/Icons'
import { useAppNavigation } from 'hooks'

import { AppBar } from './AppBar'

const AppSidebarAppBar = () => {
    const { toggleNav } = useAppNavigation()

    return (
        <AppBar>
            <Row align="center" justify="space-between" gap={1}>
                <Col css={{ display: 'flex', alignItems: 'center' }}>
                    <Logo href="/app/tasks" size="medium" />
                </Col>
                <Col css={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button
                        css={{ padding: 0 }}
                        onClick={toggleNav}
                        auto
                        size="sm"
                        light
                        icon={<ChevronsLeftIcon size={24} />}
                    />
                </Col>
            </Row>
        </AppBar>
    )
}

export { AppSidebarAppBar }
