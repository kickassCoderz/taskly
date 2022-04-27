export enum ESortOrder {
    Asc = 'asc',
    Desc = 'desc'
}

export type TFilter = {
    field: string
    value: string | number
}

export type TSort = {
    field: string
    order: ESortOrder
}

export type TOffsetPagination = {
    page?: number
    perPage?: number
}

export type TCursorPagination = {
    perPage?: number
    nextCursor?: string | number
    previousCursor?: string | number
}

export type TPagination = TOffsetPagination & TCursorPagination

export type TGetOneParams = {
    id: string | number
}

export type TGetManyParams = {
    ids: string[] | number[]
}

export type TGetListParams = {
    pagination?: TPagination
    sort?: TSort
    filter?: TFilter[]
}

export type TCreateOneParams = {
    payload: Record<string, unknown>
}

export type TCreateManyParams = {
    payload: Record<string, unknown>[]
}

export type TUpdateOneParams = {
    id: string | number
    payload: Record<string, unknown>
}

export type TUpdateManyParams = {
    ids: string[] | number[]
    payload: Record<string, unknown>[]
}

export type TDeleteOneParams = {
    id: string | number
}

export type TDeleteManyParams = {
    ids: string[] | number[]
}

export type TBaseResponse = {
    id: string | number
    [key: string]: any
}

export type TGetOneResponseData<TResponseData extends TBaseResponse> = TResponseData

export type TGetManyResponseData<TResponseData extends TBaseResponse[]> = TResponseData

export type TGetListResponseData<TResponseData extends TBaseResponse[]> = {
    data: TResponseData
    total: number
}

export type TUpdateOneResponseData<TResponseData extends TBaseResponse> = TResponseData

export type TUpdateManyResponseData<TResponseData extends TBaseResponse[]> = TResponseData

export type TCreateOneResponseData<TResponseData extends TBaseResponse> = TResponseData

export type TCreateManyResponseData<TResponseData extends TBaseResponse[]> = TResponseData

export type TDeleteOneResponseData<TResponseData extends Partial<TBaseResponse>> = TResponseData

export type TDeleteManyResponseData<TResponseData extends Partial<TBaseResponse[]>> = TResponseData

export interface IDataService {
    getOne: <TResponseData extends TBaseResponse>(
        resource: string,
        params: TGetOneParams
    ) => Promise<TGetOneResponseData<TResponseData>>
    getMany: <TResponseData extends TBaseResponse[]>(
        resource: string,
        params: TGetManyParams
    ) => Promise<TGetManyResponseData<TResponseData>>
    getList: <TResponseData extends TBaseResponse[]>(
        resource: string,
        params?: TGetListParams
    ) => Promise<TGetListResponseData<TResponseData>>
    updateOne: <TResponseData extends TBaseResponse>(
        resource: string,
        params: TUpdateOneParams
    ) => Promise<TUpdateOneResponseData<TResponseData>>
    updateMany: <TResponseData extends TBaseResponse[]>(
        resource: string,
        params: TUpdateManyParams
    ) => Promise<TUpdateManyResponseData<TResponseData>>
    createOne: <TResponseData extends TBaseResponse>(
        resource: string,
        params: TCreateOneParams
    ) => Promise<TCreateOneResponseData<TResponseData>>
    createMany: <TResponseData extends TBaseResponse[]>(
        resource: string,
        params: TCreateManyParams
    ) => Promise<TCreateManyResponseData<TResponseData>>
    deleteOne: <TResponseData extends Partial<TBaseResponse>>(
        resource: string,
        params: TDeleteOneParams
    ) => Promise<TDeleteOneResponseData<TResponseData>>
    deleteMany: <TResponseData extends Partial<TBaseResponse[]>>(
        resource: string,
        params: TDeleteManyParams
    ) => Promise<TDeleteManyResponseData<TResponseData>>
    [key: string]: any
}

export interface IAuthService {
    login: (params: any) => Promise<any>
    logout: (params?: any) => Promise<any>
    checkAuth: (params?: any) => Promise<boolean>
    getUserPermissions: () => Promise<any>
    getUserData: () => Promise<any>
    [key: string]: any
}

export type TSubscribeParamsBase = {
    channel: string
    eventTypes: string[]
    params?: Record<string, unknown>
    onChange: (event: any) => void
}

export type TUnsubscriber = () => void

export type TUnsubscribeParamsBase = Omit<TSubscribeParamsBase, 'onChange'> & {
    unsubscriber: TUnsubscriber
}
export interface IRealtimeService {
    subscribe: <TSubscribeParams extends TSubscribeParamsBase>(params: TSubscribeParams) => TUnsubscriber
    unsubscribe: <TUnsubscribeParams extends TUnsubscribeParamsBase>(params: TUnsubscribeParams) => void
}
