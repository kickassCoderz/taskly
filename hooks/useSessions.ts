import { createAuthQueryKey, EAuthBaseQueryKeyType, useAuthService } from '@kickass-admin'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { ITasklyAuthService } from 'types'

const useSessions = () => {
    const authService = useAuthService<ITasklyAuthService>()

    const queryKey = useMemo(() => createAuthQueryKey(EAuthBaseQueryKeyType.Sessions), [])

    const { data: sessions } = useQuery(queryKey, () => authService.getSessions(), {
        staleTime: 120000 // 2 minutes
    })

    return sessions
}

export default useSessions
