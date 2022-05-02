import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@kickass-admin'
import { Button, Card, Container, Input, Link as NextUILink, Loading, Spacer, Text } from '@nextui-org/react'
import { EmailIcon, GithubIcon, GitlabIcon, LandingLayout, LockIcon } from 'components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { EAuthProvider, ELoginType, TLoginParams, TLoginWithEmailAndPassParamsBase } from 'types'
import { loginValidationSchema } from 'validationSchemas'

//@TODO: add loading state when user is allready logged in because we want to redirect it to app and we dont want flashes

const SignInPage = () => {
    const router = useRouter()

    const {
        setError,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TLoginWithEmailAndPassParamsBase>({
        mode: 'onBlur',
        resolver: zodResolver(loginValidationSchema)
    })

    const loginMutation = useLogin<TLoginParams>()

    const handleLoginWithEmailAndPass = useCallback(
        (formData: TLoginWithEmailAndPassParamsBase) => {
            loginMutation.mutate(
                { ...formData, loginType: ELoginType.EmailAndPass },
                {
                    onSuccess() {
                        const redirectPath = (router.query?.loginRedirect as string) || '/app'
                        router.replace(redirectPath)
                    },
                    onError() {
                        setError('email', { type: 'response', message: 'Invalid email or password!' })
                        setError('password', { type: 'response', message: 'Invalid email or password!' })
                    }
                }
            )
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [loginMutation.mutate, setError, router.replace, router.query]
    )

    const handleLoginWithGithub = useCallback(() => {
        const loginRedirectPath = router.query?.loginRedirect || '/app'
        const redirectUrl = new URL(`${window.location.origin}${loginRedirectPath}`).toString()
        const errorUrl = new URL(window.location.toString()).toString()

        loginMutation.mutate({
            loginType: ELoginType.Provider,
            successRedirect: redirectUrl,
            errorRedirect: errorUrl,
            provider: EAuthProvider.Github,
            scopes: ['user:email', 'repo']
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginMutation.mutate, router.query])

    const handleLoginWithGitlab = useCallback(() => {
        const loginRedirectPath = router.query?.loginRedirect || '/app'
        const redirectUrl = new URL(`${window.location.origin}${loginRedirectPath}`).toString()
        const errorUrl = new URL(window.location.toString()).toString()

        loginMutation.mutate({
            loginType: ELoginType.Provider,
            successRedirect: redirectUrl,
            errorRedirect: errorUrl,
            provider: EAuthProvider.Gitlab,
            scopes: ['read_user', 'api']
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginMutation.mutate, router.query])

    return (
        <Container as="main" fluid display="flex" alignItems="center" justify="center" css={{ flex: '1' }}>
            <Card onSubmit={handleSubmit(handleLoginWithEmailAndPass)} shadow css={{ mw: '480px' }}>
                <Card.Header css={{ justifyContent: 'center' }}>
                    <Text h2>Welcome back!</Text>
                </Card.Header>
                <Card.Body as="form">
                    <Input
                        {...register('email')}
                        type="email"
                        color={!!errors.email ? 'error' : 'primary'}
                        helperColor={!!errors.email ? 'error' : 'primary'}
                        helperText={errors.email?.message}
                        contentLeft={<EmailIcon size={16} />}
                        bordered
                        label="Email"
                        placeholder="Enter your email"
                    />
                    <Spacer y={1.2} />
                    <Input
                        {...register('password')}
                        color={!!errors.password ? 'error' : 'primary'}
                        type="password"
                        helperColor={!!errors.password ? 'error' : 'primary'}
                        helperText={errors.password?.message}
                        contentRightStyling={false}
                        contentLeft={<LockIcon size={16} />}
                        contentRight={
                            <Link passHref href="/auth/forgot-password">
                                <NextUILink
                                    css={{
                                        display: 'block',
                                        px: 12,
                                        whiteSpace: 'nowrap',
                                        fontSize: '$tiny'
                                    }}
                                    color="primary"
                                >
                                    Forgot password?
                                </NextUILink>
                            </Link>
                        }
                        bordered
                        label="Password"
                        placeholder="Enter your password"
                    />
                    <Spacer y={1.6} />
                    <Button
                        disabled={loginMutation.isLoading}
                        iconRight={loginMutation.isLoading && <Loading color="currentColor" size="sm" />}
                        type="submit"
                    >
                        Sign in
                    </Button>
                    <Spacer y={0.6} />
                    <Text css={{ textAlign: 'center' }}>or</Text>
                    <Spacer y={0.6} />
                    <Button
                        type="button"
                        disabled={loginMutation.isLoading}
                        ghost
                        iconRight={
                            loginMutation.isLoading ? <Loading color="currentColor" size="sm" /> : <GithubIcon />
                        }
                        onClick={handleLoginWithGithub}
                    >
                        Sign in with Github
                    </Button>
                    <Spacer y={1.2} />
                    <Button
                        type="button"
                        ghost
                        disabled={loginMutation.isLoading}
                        iconRight={
                            loginMutation.isLoading ? <Loading color="currentColor" size="sm" /> : <GitlabIcon />
                        }
                        onClick={handleLoginWithGitlab}
                    >
                        Sign in with Gitlab
                    </Button>
                </Card.Body>
                <Card.Footer css={{ justifyContent: 'center' }}>
                    <Text small>Dont have an account?</Text>
                    <Spacer x={0.2} />
                    <Link passHref href="/auth/sign-up">
                        <NextUILink>Sign up!</NextUILink>
                    </Link>
                </Card.Footer>
            </Card>
        </Container>
    )
}

SignInPage.getLayout = (page: React.ReactElement) => {
    return <LandingLayout>{page}</LandingLayout>
}

export default SignInPage
