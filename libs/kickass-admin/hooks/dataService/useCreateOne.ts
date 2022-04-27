import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { TBaseResponse, TCreateOneParams, TCreateOneResponseData } from '../../core/types'
import { MutationError } from '../../errors'
import { createResourceBaseQueryKey, EResourceBaseQueryKeyType } from '../../utils'
import useDataService from './useDataService'

type TCreateOneVariables = {
    resource: string
    params: TCreateOneParams
}

const useCreateOne = <TResponseData extends TBaseResponse, TResponseError>(
    initVariables?: TCreateOneVariables,
    mutationOptions?: Omit<
        TUseMutationOptions<TCreateOneResponseData<TResponseData>, TResponseError, TCreateOneVariables>,
        'mutationKey' | 'mutationFn'
    >
) => {
    const dataService = useDataService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restCreateOneMutation } = useMutation<
        TCreateOneResponseData<TResponseData>,
        TResponseError,
        TCreateOneVariables
    >(variables => dataService.createOne<TResponseData>(variables.resource, variables.params), {
        onSuccess(responseData, variables) {
            const queryKeyToInvalidate = createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, variables.resource)
            queryClient.invalidateQueries(queryKeyToInvalidate)
        },
        ...mutationOptions
    })

    return {
        ...restCreateOneMutation,
        async mutate(
            callTimeVariables?: TCreateOneVariables,
            callTimeOptions?: TMutateOptions<TCreateOneResponseData<TResponseData>, TResponseError, TCreateOneVariables>
        ) {
            const resourceToCreate = initVariables?.resource || callTimeVariables?.resource
            const paramsToCreate = initVariables?.params || callTimeVariables?.params

            if (!resourceToCreate) {
                throw new MutationError('(useCreateOne) No resource provided!')
            }

            if (!!callTimeVariables?.resource && !!initVariables?.resource) {
                throw new MutationError(
                    `(useCreateOne) You provided resource in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Resource: "${initVariables?.resource}", CalltimeResource: "${callTimeVariables?.resource}"`
                )
            }

            if (!paramsToCreate) {
                throw new MutationError('(useCreateOne) No call time params provided!')
            }

            if (!!callTimeVariables?.params && !!initVariables?.params) {
                throw new MutationError(
                    `(useCreateOne) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: ${JSON.stringify(
                        initVariables?.params
                    )}, CalltimeParams: ${JSON.stringify(callTimeVariables?.params)}`
                )
            }

            return mutateAsync({ resource: resourceToCreate, params: paramsToCreate }, callTimeOptions)
        }
    }
}

export default useCreateOne
