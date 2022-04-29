import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@kickass-admin'
import { Button, Card, Container, Input, Link as NextUILink, Row, Spacer, Text } from '@nextui-org/react'
import { EmailIcon, GithubIcon, GitlabIcon, LockIcon } from 'components'
import Link from 'next/link'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { EAuthProvider, ELoginType, TLoginParams, TLoginWithEmailAndPassParamsBase } from 'types'
import { loginValidationSchema } from 'validationSchemas'

const SignInPage = () => {
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
                    onError() {
                        setError('email', { type: 'response', message: 'Invalid email or password!' })
                        setError('password', { type: 'response', message: 'Invalid email or password!' })
                    }
                }
            )
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [loginMutation.mutate, setError]
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
        <Container fluid display="flex" alignItems="center" justify="center" css={{ flex: '1' }}>
            <Card as="form" onSubmit={handleSubmit(handleLoginWithEmailAndPass)} shadow css={{ mw: '480px' }}>
                <Card.Header css={{ justifyContent: 'center' }}>
                    <Text h2>Welcome back!</Text>
                </Card.Header>
                <Card.Body>
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
                    <Button type="submit">Sign in</Button>
                    <Spacer y={0.6} />
                    <Text css={{ textAlign: 'center' }}>or</Text>
                    <Spacer y={0.6} />
                    <Button ghost iconRight={<GithubIcon />} onClick={handleLoginWithGithub}>
                        Sign in with Github
                    </Button>
                    <Spacer y={1.2} />
                    <Button ghost iconRight={<GitlabIcon />} onClick={handleLoginWithGitlab}>
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

export default SignInPage
