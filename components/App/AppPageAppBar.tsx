import { useGetUser } from '@kickass-admin'
import { Button, Col, Row, Spacer, Text } from '@nextui-org/react'
import { HamburgerIcon } from 'components/Icons'
import { useAppNavigation } from 'hooks'
import React from 'react'
import { TUserModel } from 'types'

import { AppBar } from './AppBar'
import { AppCurrentUser } from './AppCurrentUser'

type TAppPageAppBarProps = {
    title: string
    children?: React.ReactNode
}

const AppPageAppBar = ({ title }: TAppPageAppBarProps) => {
    const { isOpen, toggleNav } = useAppNavigation()
    const userQuery = useGetUser<TUserModel>()

    return (
        <AppBar sticky>
            <Row align="center" justify="space-between" gap={1}>
                <Col span={12} css={{ display: 'flex', alignItems: 'center' }}>
                    {!isOpen && (
                        <>
                            <Button
                                css={{ padding: 0 }}
                                onClick={toggleNav}
                                auto
                                size="sm"
                                light
                                icon={<HamburgerIcon size={24} />}
                            />
                            <Spacer x={1} />
                        </>
                    )}

                    <Text size={20} weight="semibold">
                        {title}
                    </Text>
                </Col>

                <Col span={12} css={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <AppCurrentUser name={userQuery.data?.name} />
                </Col>
            </Row>
        </AppBar>
    )
}

export { AppPageAppBar }
