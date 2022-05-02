import { IAuthService } from '@kickass-admin'
import { Models } from 'appwrite'
import { ELoginType, ITasklyAuthService, TLoginParams, TRegisterWithEmailAndPassParams } from 'types'

import { appwriteService } from './appwriteService'

//@TODO: handle account verification, and verification confirmation

const authService: ITasklyAuthService = {
    async login(params: TLoginParams) {
        try {
            if (params.loginType === ELoginType.EmailAndPass) {
                await appwriteService.account.createSession(params.email, params.password)
            } else {
                appwriteService.account.createOAuth2Session(
                    params.provider,
                    params.successRedirect,
                    params.errorRedirect,
                    params.scopes
                )
            }
        } catch (error) {
            console.log("[authService]: Error in 'login'", error)

            throw error
        }
    },
    async logout() {
        try {
            await appwriteService.account.deleteSessions()
        } catch (error) {
            console.log("[authService]: Error in 'logout'", error)

            throw error
        }
    },

    async register(params: TRegisterWithEmailAndPassParams) {
        try {
            await appwriteService.account.create('unique()', params.email, params.password, params.fullName)
            await appwriteService.account.createSession(params.email, params.password)
        } catch (error) {
            console.log("[authService]: Error in 'register'", error)

            throw error
        }
    },
    async checkAuth() {
        try {
            const activeUserSessionsData = await appwriteService.account.getSessions()

            return !!activeUserSessionsData?.total
        } catch (error) {
            console.log("[authService]: Error in 'checkAuth'", error)

            return false
        }
    },
    async getUserData() {
        try {
            const userData = await appwriteService.account.get()

            return userData
        } catch (error) {
            console.log("[authService]: Error in 'getUserData'", error)
            throw error
        }
    },
    async getUserPermissions() {
        throw new Error('Unimplemented')
    },
    async getSessions(): Promise<Models.Session[]> {
        try {
            const activeUserSessionsData = await appwriteService.account.getSessions()

            let { sessions } = activeUserSessionsData

            if (!Array.isArray(sessions)) {
                sessions = Object.values(sessions)
            }

            return await Promise.all(
                Object.values(sessions).map(async item => {
                    if (item.providerRefreshToken) {
                        const expiryTimestamp = item.providerAccessTokenExpiry * 1000

                        if (Date.now() > expiryTimestamp) {
                            try {
                                return await appwriteService.account.updateSession(item.$id)
                            } catch (error) {
                                console.error(error)
                            }
                        }
                    }

                    return item
                })
            )
        } catch (error) {
            console.log("[authService]: Error in 'getSessions'", error)

            return []
        }
    }
}

export { authService }
