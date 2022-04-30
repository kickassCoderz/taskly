import { useLogout } from '@kickass-admin'
import { Button, Tooltip } from '@nextui-org/react'

const RemoveMeLogout = () => {
    const logoutMutation = useLogout()
    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            <Tooltip content="I will be removed when i find my place in world">
                <Button auto onClick={() => logoutMutation.mutate()} css={{}}>
                    Log Out
                </Button>
            </Tooltip>
        </div>
    )
}

export { RemoveMeLogout }
