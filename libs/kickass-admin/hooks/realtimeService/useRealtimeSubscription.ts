import { useEffect } from 'react'

import { TSubscribeParamsBase, TUnsubscriber } from '../../core/types'
import useRealtimeService from './useRealtimeService'

type TUseRealtimeSubscriptionParams<TSubscribeParams> = TSubscribeParams & {
    enabled: boolean
}

const useRealtimeSubscription = <TSubscribeParams extends TSubscribeParamsBase>({
    channel,
    eventTypes,
    onChange,
    params,
    enabled
}: TUseRealtimeSubscriptionParams<TSubscribeParams>) => {
    const realtimeService = useRealtimeService()

    useEffect(() => {
        let unsubscriber: TUnsubscriber | undefined

        if (enabled) {
            unsubscriber = realtimeService.subscribe({
                channel,
                eventTypes,
                params,
                onChange
            })
        }

        return () => {
            if (unsubscriber) {
                realtimeService.unsubscribe({ channel, unsubscriber, eventTypes, params })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled])
}

export default useRealtimeSubscription
