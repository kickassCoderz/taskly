import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { TBaseResponse, TDeleteOneParams, TDeleteOneResponseData } from '../../core/types'
import { MutationError } from '../../errors'
import { createResourceBaseQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TDeleteOneVariables = {
    resource: string
    params: TDeleteOneParams
}

const useDeleteOne = <TResponseData extends Partial<TBaseResponse>, TResponseError>(
    initVariables?: TDeleteOneVariables,
    mutationOptions?: Omit<
        TUseMutationOptions<TDeleteOneResponseData<TResponseData>, TResponseError, TDeleteOneVariables>,
        'mutationKey' | 'mutationFn'
    >
) => {
    const dataService = useDataService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restDeleteOneMutation } = useMutation<
        TDeleteOneResponseData<TResponseData>,
        TResponseError,
        TDeleteOneVariables
    >(variables => dataService.deleteOne<TResponseData>(variables.resource, variables.params), {
        onSuccess(responseData, variables) {
            const queryKeyToInvalidate = createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, variables.resource)
            queryClient.invalidateQueries(queryKeyToInvalidate)
        },
        ...mutationOptions
    })

    return {
        ...restDeleteOneMutation,
        async mutate(
            callTimeVariables?: TDeleteOneVariables,
            callTimeOptions?: TMutateOptions<TDeleteOneResponseData<TResponseData>, TResponseError, TDeleteOneVariables>
        ) {
            const resourceToDelete = initVariables?.resource || callTimeVariables?.resource
            const paramsToDelete = initVariables?.params || callTimeVariables?.params

            if (!resourceToDelete) {
                throw new MutationError('(useDeleteOne) No resource provided!')
            }

            if (!!callTimeVariables?.resource && !!initVariables?.resource) {
                throw new MutationError(
                    `(useDeleteOne) You provided resource in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Resource: "${initVariables?.resource}", CalltimeResource: "${callTimeVariables?.resource}"`
                )
            }

            if (!paramsToDelete) {
                throw new MutationError('(useDeleteOne) No call time params provided!')
            }

            if (!!callTimeVariables?.params && !!initVariables?.params) {
                throw new MutationError(
                    `(useDeleteOne) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: ${JSON.stringify(
                        initVariables?.params
                    )}, CalltimeParams: ${JSON.stringify(callTimeVariables?.params)}`
                )
            }

            return mutateAsync({ resource: resourceToDelete, params: paramsToDelete }, callTimeOptions)
        }
    }
}

export default useDeleteOne
