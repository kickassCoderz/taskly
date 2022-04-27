import { useContext } from 'react'

import { DataServiceContext } from '../../contexts'
import { IDataService } from '../../core/types'

const useDataService = <TCustomDataService extends IDataService = IDataService>() => {
    const context = useContext(DataServiceContext)

    if (!context) {
        throw new Error('useDataService must be used within DataServiceContext')
    }

    return context as TCustomDataService
}

export default useDataService
