import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { TBaseResponse, TUpdateManyParams, TUpdateManyResponseData } from '../../core/types'
import { MutationError } from '../../errors'
import { createAllResourceBaseQueryKeys } from '../../utils'
import useDataService from './useDataService'

type TUpdateManyVariables = {
    resource: string
    params: TUpdateManyParams
}

const useUpdateMany = <TResponseData extends TBaseResponse[], TResponseError>(
    initVariables?: TUpdateManyVariables,
    mutationOptions?: Omit<
        TUseMutationOptions<TUpdateManyResponseData<TResponseData>, TResponseError, TUpdateManyVariables>,
        'mutationKey' | 'mutationFn'
    >
) => {
    const dataService = useDataService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restUpdateManyMutation } = useMutation<
        TUpdateManyResponseData<TResponseData>,
        TResponseError,
        TUpdateManyVariables
    >(variables => dataService.updateMany<TResponseData>(variables.resource, variables.params), {
        onSuccess(responseData, variables) {
            const queryKeysToInvalidate = createAllResourceBaseQueryKeys(variables.resource)

            queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
        },
        ...mutationOptions
    })

    return {
        ...restUpdateManyMutation,
        async mutate(
            callTimeVariables?: TUpdateManyVariables,
            callTimeOptions?: TMutateOptions<
                TUpdateManyResponseData<TResponseData>,
                TResponseError,
                TUpdateManyVariables
            >
        ) {
            const resourceToUpdate = initVariables?.resource || callTimeVariables?.resource
            const paramsToUpdate = initVariables?.params || callTimeVariables?.params

            if (!resourceToUpdate) {
                throw new MutationError('(useUpdateMany) No resource provided!')
            }

            if (!!callTimeVariables?.resource && !!initVariables?.resource) {
                throw new MutationError(
                    `(useUpdateMany) You provided resource in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Resource: "${initVariables?.resource}", CalltimeResource: "${callTimeVariables?.resource}"`
                )
            }

            if (!paramsToUpdate) {
                throw new MutationError('(useUpdateMany) No call time params provided!')
            }

            if (!!callTimeVariables?.params && !!initVariables?.params) {
                throw new MutationError(
                    `(useUpdateMany) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: ${JSON.stringify(
                        initVariables?.params
                    )}, CalltimeParams: ${JSON.stringify(callTimeVariables?.params)}`
                )
            }

            return mutateAsync({ resource: resourceToUpdate, params: paramsToUpdate }, callTimeOptions)
        }
    }
}

export default useUpdateMany
