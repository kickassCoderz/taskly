import { useContext } from 'react'

import { AuthServiceContext } from '../../contexts/AuthServiceProvider/AuthServiceProvider'
import { IAuthService } from '../../core/types'

const useAuthService = <TCustomAuthService extends IAuthService = IAuthService>() => {
    const context = useContext(AuthServiceContext)

    if (!context) {
        throw new Error('useAuthService must be used within AuthServiceContext')
    }

    return context as TCustomAuthService
}

export default useAuthService
