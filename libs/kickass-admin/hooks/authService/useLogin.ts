import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { MutationError } from '../../errors'
import { createAllAuthBaseQueryKeys } from '../../utils'
import useAuthService from './useAuthService'

const useLogin = <TVariables = unknown, TResponseData = void, TResponseError = unknown>(
    initVariables?: TVariables,
    mutationOptions?: Omit<TUseMutationOptions<TResponseData, TResponseError, TVariables>, 'mutationKey' | 'mutationFn'>
) => {
    const authService = useAuthService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restLoginMutation } = useMutation<TResponseData, TResponseError, TVariables>(
        async variables => await authService.login(variables),
        {
            ...mutationOptions,
            onSuccess(responseData, variables, context) {
                if (mutationOptions?.onSuccess) {
                    mutationOptions?.onSuccess(responseData, variables, context)
                }

                const queryKeysToInvalidate = createAllAuthBaseQueryKeys()
                queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
            }
        }
    )

    return {
        ...restLoginMutation,
        mutate(
            callTimeVariables?: TVariables,
            callTimeOptions?: TMutateOptions<TResponseData, TResponseError, TVariables>
        ) {
            const loginParams = initVariables || callTimeVariables

            if (!loginParams) {
                throw new MutationError('(useLogin) No params provided!')
            }

            if (!!initVariables && !!callTimeVariables) {
                throw new MutationError(
                    `(useLogin) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: "${JSON.stringify(
                        initVariables
                    )}", Calltime Params: "${JSON.stringify(callTimeVariables)}"`
                )
            }

            return mutateAsync(loginParams, callTimeOptions)
        }
    }
}

export default useLogin
