import { createContext } from 'react'

import { IAuthService } from '../../core/types'

export const AuthServiceContext = createContext<IAuthService | undefined>(undefined)

AuthServiceContext.displayName = 'AuthServiceContext'

export interface IAuthServiceProvider {
    children: React.ReactNode
    authService?: IAuthService
}

export const AuthServiceProvider = ({ children, authService }: IAuthServiceProvider) => {
    return <AuthServiceContext.Provider value={authService}>{children}</AuthServiceContext.Provider>
}
