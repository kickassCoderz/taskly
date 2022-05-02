import { IAuthService } from '@kickass-admin'
import { Models } from 'appwrite'

export enum ELoginType {
    Provider = 'provider',
    EmailAndPass = 'emailAndPass'
}

export enum EAuthProvider {
    Github = 'github',
    Gitlab = 'gitlab'
}

export type TLoginWithEmailAndPassParamsBase = {
    email: string
    password: string
}

export type TLoginWithEmailAndPassParams = TLoginWithEmailAndPassParamsBase & {
    loginType: ELoginType.EmailAndPass
}

export type TLoginOAuthParams = {
    loginType: ELoginType.Provider
    provider: EAuthProvider
    successRedirect: string
    errorRedirect: string
}

export type TLoginParams = TLoginWithEmailAndPassParams | TLoginOAuthParams

export type TRegisterWithEmailAndPassParamsBase = {
    email: string
    password: string
    fullName: string
}

export type TRegisterWithEmailAndPassParams = TRegisterWithEmailAndPassParamsBase & {
    emailVerificationRedirect: string
}

export interface ITasklyAuthService extends IAuthService {
    getSessions: () => Promise<Models.Session[]>
}
