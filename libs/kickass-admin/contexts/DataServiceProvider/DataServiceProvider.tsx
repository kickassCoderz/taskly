import { createContext } from 'react'

import { IDataService } from '../../core/types'

export interface IDataServiceProvider {
    children: React.ReactNode
    dataService?: IDataService
}

export const DataServiceContext = createContext<IDataService | undefined>(undefined)

export const DataServiceProvider = ({ children, dataService }: IDataServiceProvider) => {
    return <DataServiceContext.Provider value={dataService}>{children}</DataServiceContext.Provider>
}
