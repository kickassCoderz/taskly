import { useMemo } from 'react'
import { useQuery, UseQueryOptions as TUseQueryOptions } from 'react-query'

import { TBaseResponse, TGetManyParams, TGetManyResponseData } from '../../core/types'
import { createResourceQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TGetManyVariables = {
    resource: string
    params: TGetManyParams
}

const useGetMany = <TResponseData extends TBaseResponse[], TResponseError>(
    variables: TGetManyVariables,
    queryOptions?: Omit<TUseQueryOptions<TGetManyResponseData<TResponseData>, TResponseError>, 'queryKey' | 'queryFn'>
) => {
    const dataService = useDataService()
    const queryKey = useMemo(
        () => createResourceQueryKey(EResourceBaseQueryKeyType.Many, variables?.resource, variables?.params),
        [variables]
    )

    const getManyQuery = useQuery<TGetManyResponseData<TResponseData>, TResponseError>(
        queryKey,
        () => dataService.getMany<TResponseData>(variables?.resource, variables?.params),
        {
            enabled: !!variables?.params?.ids?.length,
            ...queryOptions
        }
    )

    return getManyQuery
}

export default useGetMany
