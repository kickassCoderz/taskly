import { createContext } from 'react'

import { IRealtimeService } from '../../core/types'

export interface IRealtimeServiceProvider {
    children: React.ReactNode
    realtimeService?: IRealtimeService
}

export const RealtimeServiceContext = createContext<IRealtimeService | undefined>(undefined)

export const RealtimeServiceProvider = ({ children, realtimeService }: IRealtimeServiceProvider) => {
    return <RealtimeServiceContext.Provider value={realtimeService}>{children}</RealtimeServiceContext.Provider>
}
