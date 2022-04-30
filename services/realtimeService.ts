import { IRealtimeService } from '@kickass-admin'

import { appwriteService } from './appwriteService'

export enum ESubscriptionEventTypes {
    Create = 'create',
    Update = 'update',
    Delete = 'delete',
    SessionCreate = 'sessionCreate',
    SessionDelete = 'sessionDelete',
    SessionUpdate = 'sessionUpdate'
}

// type TSubscriptionParams

const appwriteToKickassEventTypeMap = {
    'database.documents.create': ESubscriptionEventTypes.Create,
    'database.documents.update': ESubscriptionEventTypes.Update,
    'database.documents.delete': ESubscriptionEventTypes.Delete,
    'account.sessions.create': ESubscriptionEventTypes.SessionCreate,
    'account.sessions.delete': ESubscriptionEventTypes.SessionDelete,
    'account.sessions.update': ESubscriptionEventTypes.SessionUpdate
}

const getKickassEvent = (event: keyof typeof appwriteToKickassEventTypeMap) => {
    return appwriteToKickassEventTypeMap[event]
}

const createAppwriteChannel = (channel: string, ids?: string[]) => {
    if (channel === 'account') {
        return channel
    }

    return ids?.length ? ids.map(id => `collections.${channel}.document.${id}`) : `collections.${channel}.document`
}

type TOnChangeEvent<TPayload> = {
    channel: string
    eventType: ESubscriptionEventTypes
    timestamp: number
    payload: TPayload
}

export type TRealtimeParams = {
    channel: string
    eventTypes: ESubscriptionEventTypes[]
    params?: {
        ids?: string[]
    }
    onChange: <TPayload>(event: TOnChangeEvent<TPayload>) => void
}

const realtimeService: IRealtimeService = {
    subscribe(subscribeParams) {
        const { channel, eventTypes, params, onChange } = subscribeParams as TRealtimeParams

        const appwriteChannel = createAppwriteChannel(channel, params?.ids)

        return appwriteService.subscribe(appwriteChannel, payload => {
            const kickassEvent = getKickassEvent(payload.event as keyof typeof appwriteToKickassEventTypeMap)

            if (eventTypes.includes(kickassEvent)) {
                onChange({
                    channel,
                    eventType: kickassEvent,
                    timestamp: payload.timestamp,
                    payload: payload.payload
                })
            }
        })
    },

    unsubscribe(params) {
        params.unsubscriber()
    }
}

export { realtimeService }
