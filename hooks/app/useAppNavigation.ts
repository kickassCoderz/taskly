import { AppNavigationContext } from 'providers'
import { useContext } from 'react'

const useAppNavigation = () => {
    const appNavContext = useContext(AppNavigationContext)

    if (!appNavContext) {
        throw new Error('[useAppNavigation]: useAppNavigation must be used inside AppNavigationProvider')
    }

    return appNavContext
}

export { useAppNavigation }
