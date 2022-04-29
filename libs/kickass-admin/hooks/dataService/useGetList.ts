import { useMemo } from 'react'
import { useQuery, UseQueryOptions as TUseQueryOptions } from 'react-query'

import { TBaseResponse, TGetListParams, TGetListResponseData } from '../../core/types'
import { createResourceQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TGetListVariables = {
    resource: string
    params?: TGetListParams
}

const useGetList = <TResponseData extends TBaseResponse[], TResponseError>(
    variables: TGetListVariables,
    queryOptions?: Omit<TUseQueryOptions<TGetListResponseData<TResponseData>, TResponseError>, 'queryKey' | 'queryFn'>
) => {
    const dataService = useDataService()

    const queryKey = useMemo(
        () => createResourceQueryKey(EResourceBaseQueryKeyType.List, variables?.resource, variables?.params),
        [variables]
    )

    const { data, ...restGetListQuery } = useQuery<TGetListResponseData<TResponseData>, TResponseError>(
        queryKey,
        () => dataService.getList<TResponseData>(variables?.resource, variables?.params),
        queryOptions
    )

    return {
        data: data?.data,
        total: data?.total,
        ...restGetListQuery
    }
}

export default useGetList
