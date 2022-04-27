import { useMemo } from 'react'
import { useQuery, UseQueryOptions as TUseQueryOptions } from 'react-query'

import { createAuthQueryKey, EAuthBaseQueryKeyType } from '../../utils'
import useAuthService from './useAuthService'
import useCheckAuth from './useCheckAuth'

const useGetUserPermissions = <TResponseData = unknown, TResponseError = unknown>(
    queryOptions?: Omit<TUseQueryOptions<TResponseData, TResponseError>, 'queryKey' | 'queryFn'>
) => {
    const authService = useAuthService()
    const { isAuthenticated } = useCheckAuth()

    const queryKey = useMemo(() => createAuthQueryKey(EAuthBaseQueryKeyType.UserPermissions), [])

    const userQuery = useQuery<TResponseData, TResponseError>(queryKey, () => authService.getUserPermissions(), {
        enabled: isAuthenticated,
        ...queryOptions
    })

    return userQuery
}

export default useGetUserPermissions
