import { useMemo } from 'react'
import { useQuery, UseQueryOptions as TUseQueryOptions } from 'react-query'

import { TBaseResponse, TGetOneParams, TGetOneResponseData } from '../../core/types'
import { createResourceQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TGetOneVariables = {
    resource: string
    params: TGetOneParams
}

const useGetOne = <TResponseData extends TBaseResponse, TResponseError>(
    variables: TGetOneVariables,
    queryOptions?: Omit<TUseQueryOptions<TGetOneResponseData<TResponseData>, TResponseError>, 'queryKey' | 'queryFn'>
) => {
    const dataService = useDataService()
    const queryKey = useMemo(
        // @NOTE: useGetOne key was the same for all resources, added variables.params to differentiate
        () => createResourceQueryKey(EResourceBaseQueryKeyType.One, variables?.resource, variables.params),
        [variables?.resource, variables.params]
    )

    const getOneQuery = useQuery<TGetOneResponseData<TResponseData>, TResponseError>(
        queryKey,
        () => dataService.getOne<TResponseData>(variables?.resource, variables?.params),
        {
            enabled: !!variables?.params?.id,
            ...queryOptions
        }
    )

    return getOneQuery
}

export default useGetOne
