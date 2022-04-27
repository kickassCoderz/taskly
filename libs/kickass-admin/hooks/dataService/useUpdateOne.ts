import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { TBaseResponse, TUpdateOneParams, TUpdateOneResponseData } from '../../core/types'
import { MutationError } from '../../errors'
import { createAllResourceBaseQueryKeys } from '../../utils'
import useDataService from './useDataService'

type TUpdateOneVariables = {
    resource: string
    params: TUpdateOneParams
}

const useUpdateOne = <TResponseData extends TBaseResponse, TResponseError>(
    initVariables?: TUpdateOneVariables,
    mutationOptions?: Omit<
        TUseMutationOptions<TUpdateOneResponseData<TResponseData>, TResponseError, TUpdateOneVariables>,
        'mutationKey' | 'mutationFn'
    >
) => {
    const dataService = useDataService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restUpdateOneMutation } = useMutation<
        TUpdateOneResponseData<TResponseData>,
        TResponseError,
        TUpdateOneVariables
    >(variables => dataService.updateOne<TResponseData>(variables.resource, variables.params), {
        onSuccess(responseData, variables) {
            const queryKeysToInvalidate = createAllResourceBaseQueryKeys(variables.resource)
            queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
        },
        ...mutationOptions
    })

    return {
        ...restUpdateOneMutation,
        async mutate(
            callTimeVariables?: TUpdateOneVariables,
            callTimeOptions?: TMutateOptions<TUpdateOneResponseData<TResponseData>, TResponseError, TUpdateOneVariables>
        ) {
            const resourceToUpdate = initVariables?.resource || callTimeVariables?.resource
            const paramsToUpdate = initVariables?.params || callTimeVariables?.params

            if (!resourceToUpdate) {
                throw new MutationError('(useUpdateOne) No resource provided!')
            }

            if (!!callTimeVariables?.resource && !!initVariables?.resource) {
                throw new MutationError(
                    `(useUpdateOne) You provided resource in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Resource: "${initVariables?.resource}", CalltimeResource: "${callTimeVariables?.resource}"`
                )
            }

            if (!paramsToUpdate) {
                throw new MutationError('(useUpdateOne) No call time params provided!')
            }

            if (!!callTimeVariables?.params && !!initVariables?.params) {
                throw new MutationError(
                    `(useUpdateOne) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: ${JSON.stringify(
                        initVariables?.params
                    )}, CalltimeParams: ${JSON.stringify(callTimeVariables?.params)}`
                )
            }

            return mutateAsync({ resource: resourceToUpdate, params: paramsToUpdate }, callTimeOptions)
        }
    }
}

export default useUpdateOne
