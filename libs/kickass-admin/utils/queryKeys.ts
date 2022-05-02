export enum EResourceBaseQueryKeyType {
    One = 'one',
    Many = 'many',
    List = 'list'
}

export enum EAuthBaseQueryKeyType {
    User = 'user',
    UserPermissions = 'userPermissions',
    IsAuthenticated = 'isAuthenticated',
    Sessions = 'sessions' // @NOTE: maybe support custom types here
}

const createResourceBaseQueryKey = (type: EResourceBaseQueryKeyType, resource: string) => {
    return `resource|${type}|${resource}`
}

const createAllResourceBaseQueryKeys = (resource: string) => {
    return Object.values(EResourceBaseQueryKeyType).map(keyValue => createResourceBaseQueryKey(keyValue, resource))
}

const createResourceQueryKey = (
    type: EResourceBaseQueryKeyType,
    resource: string,
    params?: Record<string, unknown>
) => {
    return [createResourceBaseQueryKey(type, resource), params].filter(Boolean)
}

const createAuthBaseQueryKey = (type: EAuthBaseQueryKeyType) => {
    return `auth|${type}`
}

const createAllAuthBaseQueryKeys = () => {
    return Object.values(EAuthBaseQueryKeyType).map(keyValue => createAuthBaseQueryKey(keyValue))
}

const createAuthQueryKey = (type: EAuthBaseQueryKeyType, params?: Record<string, unknown>) => {
    return [createAuthBaseQueryKey(type), params].filter(Boolean)
}

export {
    createAllAuthBaseQueryKeys,
    createAllResourceBaseQueryKeys,
    createAuthBaseQueryKey,
    createAuthQueryKey,
    createResourceBaseQueryKey,
    createResourceQueryKey
}
