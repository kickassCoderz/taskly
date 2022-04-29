import { IAuthService } from '@kickass-admin'
import { ELoginType, TLoginParams, TRegisterWithEmailAndPassParams } from 'types'

import { appwriteService } from './appwriteService'

const authService: IAuthService = {
    async login(params: TLoginParams) {
        if (params.loginType === ELoginType.EmailAndPass) {
            await appwriteService.account.createSession(params.email, params.password)
        } else {
            appwriteService.account.createOAuth2Session(params.provider, params.successRedirect, params.errorRedirect)
        }
    },
    async logout() {
        await appwriteService.account.deleteSessions()
    },

    async register(params: TRegisterWithEmailAndPassParams) {
        //@TODO: untangle this shit
        try {
            //
            await appwriteService.account.create('unique()', params.email, params.password, params.fullName)

            await appwriteService.account.createVerification(params.emailVerificationRedirect)
        } catch (error) {
            throw error
        }
    },
    async checkAuth() {
        try {
            const activeUserSessionsData = await appwriteService.account.getSessions()

            return !!activeUserSessionsData?.sessions?.length
        } catch (error) {
            return false
        }
    },
    async getUserData() {
        return appwriteService.account.get()
    },
    async getUserPermissions() {
        throw new Error('Unimplemented')
    }
}

export { authService }
