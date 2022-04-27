/* eslint-disable react/jsx-no-useless-fragment */
import { UseQueryOptions as TUseQueryOptions } from 'react-query'

import { useCheckAuth } from '../../hooks'

//@NOTE: Currently all returns are wrapped with fragments because of known TS issue https://github.com/microsoft/TypeScript/issues/21699

interface ICheckAuth {
    children: React.ReactNode
    loadingComponent?: React.ReactNode
    errorComponent?: React.ReactNode
    fallbackComponent?: React.ReactNode
    queryOptions?: Omit<TUseQueryOptions<boolean, unknown>, 'queryKey' | 'queryFn' | 'onSuccess' | 'onError'>
    onAuthCheckSuccess?: (authState: boolean) => void
    onAuthCheckError?: (error: unknown) => void
}

const CheckAuth = ({
    children,
    loadingComponent,
    errorComponent,
    fallbackComponent,
    queryOptions,
    onAuthCheckSuccess,
    onAuthCheckError
}: ICheckAuth) => {
    const { isAuthenticated, isLoading, isSuccess, isError } = useCheckAuth({
        onSuccess: onAuthCheckSuccess,
        onError: onAuthCheckError,
        ...queryOptions
    })

    if (isLoading) {
        return loadingComponent ? <>{loadingComponent}</> : null
    }

    if (isError) {
        return errorComponent ? <>{errorComponent}</> : null
    }

    if (isSuccess && !isAuthenticated) {
        return fallbackComponent ? <>{fallbackComponent}</> : null
    }

    return <>{children}</>
}

export default CheckAuth
