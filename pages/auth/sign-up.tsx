import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin, useRegister } from '@kickass-admin'
import { Button, Card, Container, Input, Link as NextUILink, Spacer, Text } from '@nextui-org/react'
import { AppwriteException } from 'appwrite'
import { EmailIcon, GithubIcon, GitlabIcon, LandingLayout, LockIcon, UserIcon } from 'components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
    EAuthProvider,
    ELoginType,
    TLoginOAuthParams,
    TRegisterWithEmailAndPassParams,
    TRegisterWithEmailAndPassParamsBase
} from 'types'
import { registerValidationSchema } from 'validationSchemas'

const SignUpPage = () => {
    const router = useRouter()
    const {
        setError,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TRegisterWithEmailAndPassParamsBase>({
        mode: 'onBlur',
        resolver: zodResolver(registerValidationSchema)
    })

    const loginMutation = useLogin<TLoginOAuthParams>()

    const registerMutation = useRegister<TRegisterWithEmailAndPassParams>()

    const handleRegisterWithEmailAndPass = useCallback(
        (formData: TRegisterWithEmailAndPassParamsBase) => {
            const redirectUrl = new URL(window.location.toString()).toString()

            registerMutation.mutate(
                { ...formData, emailVerificationRedirect: redirectUrl },
                {
                    onSuccess() {
                        router.replace('/app')
                    },
                    onError(error) {
                        const appWriteError = error as AppwriteException

                        setError('email', { message: `${appWriteError.message}!` }, { shouldFocus: true })
                    }
                }
            )
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [registerMutation.mutate, router.replace]
    )

    const handleLoginWithGithub = useCallback(() => {
        const redirectUrl = new URL(window.location.toString()).toString()

        loginMutation.mutate({
            loginType: ELoginType.Provider,
            successRedirect: redirectUrl,
            errorRedirect: redirectUrl,
            provider: EAuthProvider.Github
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginMutation.mutate])

    const handleLoginWithGitlab = useCallback(() => {
        const redirectUrl = new URL(window.location.toString()).toString()

        loginMutation.mutate({
            loginType: ELoginType.Provider,
            successRedirect: redirectUrl,
            errorRedirect: redirectUrl,
            provider: EAuthProvider.Gitlab
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginMutation.mutate])

    return (
        <Container as="main" fluid display="flex" alignItems="center" justify="center" css={{ flex: '1' }}>
            <Card as="form" onSubmit={handleSubmit(handleRegisterWithEmailAndPass)} shadow css={{ mw: '480px' }}>
                <Card.Header css={{ justifyContent: 'center' }}>
                    <Text h2>Let&apos;s be productive!</Text>
                </Card.Header>
                <Card.Body>
                    <Input
                        type="text"
                        {...register('fullName')}
                        bordered
                        label="Full name"
                        placeholder="John Doe"
                        color={!!errors.fullName ? 'error' : 'primary'}
                        helperColor={!!errors.fullName ? 'error' : 'primary'}
                        helperText={errors.fullName?.message}
                        contentLeft={<UserIcon size={16} />}
                    />
                    <Spacer y={1.2} />
                    <Input
                        {...register('email')}
                        bordered
                        type="email"
                        label="Email"
                        placeholder="example@email.com"
                        color={!!errors.email ? 'error' : 'primary'}
                        helperColor={!!errors.email ? 'error' : 'primary'}
                        helperText={errors.email?.message}
                        contentLeft={<EmailIcon size={16} />}
                    />
                    <Spacer y={1.2} />
                    <Input.Password
                        {...register('password')}
                        bordered
                        label="Choose password"
                        placeholder="Minimum 8 characters"
                        color={!!errors.password ? 'error' : 'primary'}
                        helperColor={!!errors.password ? 'error' : 'primary'}
                        helperText={errors.password?.message}
                        contentLeft={<LockIcon size={16} />}
                    />
                    <Spacer y={1.6} />
                    <Button type="submit">Sign up</Button>
                    <Spacer y={0.6} />
                    <Text css={{ textAlign: 'center' }}>or</Text>
                    <Spacer y={0.6} />
                    <Button ghost iconRight={<GithubIcon />} onClick={handleLoginWithGithub}>
                        Sign up with Github
                    </Button>
                    <Spacer y={1.2} />
                    <Button ghost iconRight={<GitlabIcon />} onClick={handleLoginWithGitlab}>
                        Sign up with Gitlab
                    </Button>
                </Card.Body>
                <Card.Footer css={{ justifyContent: 'center' }}>
                    <Text small>Allready have an account?</Text>
                    <Spacer x={0.2} />
                    <Link passHref href="/auth/sign-in">
                        <NextUILink>Sign in!</NextUILink>
                    </Link>
                </Card.Footer>
            </Card>
        </Container>
    )
}

SignUpPage.getLayout = (page: React.ReactElement) => {
    return <LandingLayout>{page}</LandingLayout>
}

export default SignUpPage
