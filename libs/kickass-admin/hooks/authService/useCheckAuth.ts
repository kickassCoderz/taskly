import { useMemo } from 'react'
import { useQuery, UseQueryOptions as TUseQueryOptions } from 'react-query'

import { createAuthQueryKey, EAuthBaseQueryKeyType } from '../../utils'
import useAuthService from './useAuthService'

const useCheckAuth = <TResponseError = unknown>(
    queryOptions?: Omit<TUseQueryOptions<boolean, TResponseError>, 'queryKey' | 'queryFn'>
) => {
    const authService = useAuthService()
    const queryKey = useMemo(() => createAuthQueryKey(EAuthBaseQueryKeyType.IsAuthenticated), [])

    const { data, ...restCheckAuthQuery } = useQuery<boolean, TResponseError>(
        queryKey,
        () => authService.checkAuth(),
        queryOptions
    )

    return {
        isAuthenticated: !!data,
        ...restCheckAuthQuery
    }
}

export default useCheckAuth
