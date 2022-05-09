import '@uiw/react-markdown-preview/markdown.css'

import { markdown } from '@codemirror/lang-markdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { createResourceQueryKey, EResourceBaseQueryKeyType, useCreateOne } from '@kickass-admin'
import { Button, Col, Grid, Input, Loading, Row, Spacer, Text } from '@nextui-org/react'
import CodeMirror from '@uiw/react-codemirror'
import { AppwriteException } from 'appwrite'
import { AppFeatureBar, AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import { useSessions, useTheme } from 'hooks'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { TTask } from 'types'
import { editValidationSchema } from 'validationSchemas'

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

const AppTaskCreatePage = () => {
    const queryClient = useQueryClient()
    const session = useSessions()?.[0]
    const router = useRouter()
    const theme = useTheme()
    const [isPreviewEnabled, setPreviewEnabled] = useState(false)

    const pageTitle = `Create new task`

    const createMutation = useCreateOne<TTask, AppwriteException>()

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<TTask>({
        mode: 'onBlur',
        resolver: zodResolver(editValidationSchema)
    })

    const handleCreate = useCallback(
        (createdTask: TTask) => {
            if (!session) {
                return
            }

            if (createMutation.isLoading) {
                return
            }

            createMutation.mutate(
                {
                    resource: 'tasks',
                    params: {
                        payload: {
                            ...createdTask
                        }
                    }
                },
                {
                    onSuccess(data) {
                        queryClient.setQueryData(
                            createResourceQueryKey(EResourceBaseQueryKeyType.One, 'tasks', { id: data.id }),
                            data
                        )

                        router.push({
                            pathname: `/app/tasks/${data.id}`
                        })
                    }
                }
            )
        },
        [session, createMutation, router, queryClient]
    )

    return (
        <>
            <NextSeo title={pageTitle} />
            <AppPageAppBar title={pageTitle} />
            <AppFeatureBar>
                <Row gap={1} align="center" justify="center">
                    <Col css={{ display: 'flex', justifyContent: 'flex-start' }}></Col>
                    <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            size="xs"
                            onClick={() => {
                                setPreviewEnabled(current => !current)
                            }}
                        >
                            {/* TODO maybe some fancy icon? */}
                            {isPreviewEnabled ? 'Edit' : 'Preview'}
                        </Button>
                        <Spacer x={0.6} />
                        <Button
                            disabled={createMutation.isLoading}
                            size="xs"
                            iconRight={createMutation.isLoading && <Loading color="currentColor" size="sm" />}
                            type="submit"
                            onClick={handleSubmit(handleCreate)}
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
            </AppFeatureBar>
            <AppPageContainer>
                <Grid.Container gap={2}>
                    <Grid as="form">
                        {!!createMutation.error && (
                            <>
                                <Text h5 color="error">
                                    Error: {createMutation.error.message}
                                </Text>
                                <Spacer y={1.2} />
                            </>
                        )}
                        <Input
                            {...register('title')}
                            type="text"
                            color={!!errors.title ? 'error' : 'primary'}
                            helperColor={!!errors.title ? 'error' : 'primary'}
                            helperText={errors.title?.message}
                            bordered
                            label="Title"
                            placeholder="Title"
                        />
                        <Spacer y={1.2} />
                        <Controller
                            control={control}
                            name="content"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <>
                                        <Col>
                                            <Text style={{ marginLeft: 10 }} color="primary">
                                                Content
                                            </Text>
                                            {isPreviewEnabled ? (
                                                <div data-color-mode={theme.isDark ? 'dark' : 'light'}>
                                                    <MarkdownPreview
                                                        style={{
                                                            padding: 20,
                                                            width: '100vw',
                                                            maxWidth: '800px'
                                                        }}
                                                        source={value}
                                                    />
                                                </div>
                                            ) : (
                                                <CodeMirror
                                                    theme={theme.isDark ? 'dark' : 'light'}
                                                    value={value || ''}
                                                    width="100vw"
                                                    maxWidth="800px"
                                                    height="400px"
                                                    extensions={[markdown({})]}
                                                    onChange={(value, _viewUpdate) => {
                                                        onChange(value)
                                                    }}
                                                />
                                            )}
                                        </Col>
                                    </>
                                )
                            }}
                        />
                        <Spacer y={1.2} />
                    </Grid>
                </Grid.Container>
            </AppPageContainer>
        </>
    )
}

AppTaskCreatePage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppTaskCreatePage
