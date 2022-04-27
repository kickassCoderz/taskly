import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { TBaseResponse, TDeleteManyParams, TDeleteManyResponseData } from '../../core/types'
import { MutationError } from '../../errors'
import { createResourceBaseQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TDeleteManyVariables = {
    resource: string
    params: TDeleteManyParams
}

const useDeleteMany = <TResponseData extends Partial<TBaseResponse[]>, TResponseError>(
    initVariables?: TDeleteManyVariables,
    mutationOptions?: Omit<
        TUseMutationOptions<TDeleteManyResponseData<TResponseData>, TResponseError, TDeleteManyVariables>,
        'mutationKey' | 'mutationFn'
    >
) => {
    const dataService = useDataService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restDeleteManyMutation } = useMutation<
        TDeleteManyResponseData<TResponseData>,
        TResponseError,
        TDeleteManyVariables
    >(variables => dataService.deleteMany<TResponseData>(variables.resource, variables.params), {
        onSuccess(responseData, variables) {
            const queryKeyToInvalidate = createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, variables.resource)
            queryClient.invalidateQueries(queryKeyToInvalidate)
        },
        ...mutationOptions
    })

    return {
        ...restDeleteManyMutation,
        async mutate(
            callTimeVariables?: TDeleteManyVariables,
            callTimeOptions?: TMutateOptions<
                TDeleteManyResponseData<TResponseData>,
                TResponseError,
                TDeleteManyVariables
            >
        ) {
            const resourceToDelete = initVariables?.resource || callTimeVariables?.resource
            const paramsToDelete = initVariables?.params || callTimeVariables?.params

            if (!resourceToDelete) {
                throw new MutationError('(useDeleteMany) No resource provided!')
            }

            if (!!callTimeVariables?.resource && !!initVariables?.resource) {
                throw new MutationError(
                    `(useDeleteMany) You provided resource in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Resource: "${initVariables?.resource}", CalltimeResource: "${callTimeVariables?.resource}"`
                )
            }

            if (!paramsToDelete) {
                throw new MutationError('(useDeleteMany) No call time params provided!')
            }

            if (!!callTimeVariables?.params && !!initVariables?.params) {
                throw new MutationError(
                    `(useDeleteMany) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: ${JSON.stringify(
                        initVariables?.params
                    )}, CalltimeParams: ${JSON.stringify(callTimeVariables?.params)}`
                )
            }

            return mutateAsync({ resource: resourceToDelete, params: paramsToDelete }, callTimeOptions)
        }
    }
}

export default useDeleteMany
