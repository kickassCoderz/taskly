import {
    MutateOptions as TMutateOptions,
    useMutation,
    UseMutationOptions as TUseMutationOptions,
    useQueryClient
} from 'react-query'

import { MutationError } from '../../errors'
import { createAuthBaseQueryKey, EAuthBaseQueryKeyType } from '../../utils'
import useAuthService from './useAuthService'

const useLogout = <TVariables = unknown, TResponseData = void, TResponseError = unknown>(
    initVariables?: TVariables,
    mutationOptions?: Omit<TUseMutationOptions<TResponseData, TResponseError, TVariables>, 'mutationKey' | 'mutationFn'>
) => {
    const authService = useAuthService()
    const queryClient = useQueryClient()

    const { mutateAsync, ...restLoginMutation } = useMutation<TResponseData, TResponseError, TVariables>(
        variables => authService.logout(variables),
        {
            ...mutationOptions,
            onSuccess(responseData, variables, context) {
                if (mutationOptions?.onSuccess) {
                    mutationOptions.onSuccess(responseData, variables, context)
                }

                const checkAuthQueryKey = createAuthBaseQueryKey(EAuthBaseQueryKeyType.IsAuthenticated)
                queryClient.invalidateQueries(checkAuthQueryKey)

                const authUserQueryKeys = [
                    createAuthBaseQueryKey(EAuthBaseQueryKeyType.User),
                    createAuthBaseQueryKey(EAuthBaseQueryKeyType.UserPermissions)
                ]

                authUserQueryKeys.forEach(key => queryClient.setQueryData(key, undefined))
            }
        }
    )

    return {
        ...restLoginMutation,
        mutate(
            callTimeVariables?: TVariables,
            callTimeOptions?: TMutateOptions<TResponseData, TResponseError, TVariables>
        ) {
            const logoutParams = initVariables || callTimeVariables

            if (!!initVariables && !!callTimeVariables) {
                throw new MutationError(
                    `(useLogout) You provided params in hook and mutate calltime! This is considered antipatern and can cause unwanted behavior. Params: "${JSON.stringify(
                        initVariables
                    )}", Calltime Params: "${JSON.stringify(callTimeVariables)}"`
                )
            }

            return mutateAsync(logoutParams as TVariables, callTimeOptions)
        }
    }
}

export default useLogout
