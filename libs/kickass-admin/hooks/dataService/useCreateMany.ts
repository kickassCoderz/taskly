import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { TBaseResponse, TCreateManyParams, TCreateManyResponseData } from '../../core/types'
import { MutationError } from '../../errors'
import { createResourceBaseQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TCreateManyVariables = {
    resource: string
    params: TCreateManyParams
}

const useCreateMany = <TResponseData extends TBaseResponse[], TResponseError>(
    initVariables?: TCreateManyVariables,
    mutationOptions?: Omit<
        TUseMutationOptions<TCreateManyResponseData<TResponseData>, TResponseError, TCreateManyVariables>,
        'mutationKey' | 'mutationFn'
    >
) => {
    const dataService = useDataService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restCreateManyMutation } = useMutation<
        TCreateManyResponseData<TResponseData>,
        TResponseError,
        TCreateManyVariables
    >(variables => dataService.createMany<TResponseData>(variables.resource, variables.params), {
        onSuccess(data, variables) {
            const queryKeyToInvalidate = createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, variables.resource)

            queryClient.invalidateQueries(queryKeyToInvalidate)
        },
        ...mutationOptions
    })

    return {
        ...restCreateManyMutation,
        async mutate(
            callTimeVariables?: TCreateManyVariables,
            callTimeOptions?: TMutateOptions<
                TCreateManyResponseData<TResponseData>,
                TResponseError,
                TCreateManyVariables
            >
        ) {
            const resourceToCreate = initVariables?.resource || callTimeVariables?.resource
            const paramsToCreate = initVariables?.params || callTimeVariables?.params

            if (!resourceToCreate) {
                throw new MutationError('(useCreateMany) No resource provided!')
            }

            if (!!callTimeVariables?.resource && !!initVariables?.resource) {
                throw new MutationError(
                    `(useCreateMany) You provided resource in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Resource: "${initVariables?.resource}", CalltimeResource: "${callTimeVariables?.resource}"`
                )
            }

            if (!paramsToCreate) {
                throw new MutationError('(useCreateMany) No call time params provided!')
            }

            if (!!callTimeVariables?.params && !!initVariables?.params) {
                throw new MutationError(
                    `(useCreateMany) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: ${JSON.stringify(
                        initVariables?.params
                    )}, CalltimeParams: ${JSON.stringify(callTimeVariables?.params)}`
                )
            }

            return mutateAsync({ resource: resourceToCreate, params: paramsToCreate }, callTimeOptions)
        }
    }
}

export default useCreateMany
