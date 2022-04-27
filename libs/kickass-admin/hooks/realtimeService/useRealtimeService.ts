import { useContext } from 'react'

import { RealtimeServiceContext } from '../../contexts'
import { IRealtimeService } from '../../core/types'

const useRealtimeService = <TCustomRealtimeService extends IRealtimeService = IRealtimeService>() => {
    const context = useContext(RealtimeServiceContext)

    if (!context) {
        throw new Error('useRealtimeService must be used within RealtimeServiceContext')
    }

    return context as TCustomRealtimeService
}

export default useRealtimeService
