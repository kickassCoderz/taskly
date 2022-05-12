import '@uiw/react-markdown-preview/markdown.css'

import { markdown } from '@codemirror/lang-markdown'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    createResourceBaseQueryKey,
    EResourceBaseQueryKeyType,
    TGetListResponseData,
    useGetOne,
    useUpdateOne
} from '@kickass-admin'
import { Button, Col, Grid, Input, Loading, Row, Spacer, Text } from '@nextui-org/react'
import CodeMirror from '@uiw/react-codemirror'
import { AppwriteException } from 'appwrite'
import { AppFeatureBar, AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import { useSessions, useTheme } from 'hooks'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { TTask } from 'types'
import { editValidationSchema } from 'validationSchemas'

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

const AppTaskPage = () => {
    const queryClient = useQueryClient()
    const session = useSessions()?.[0]
    const router = useRouter()
    const taskId = router.query.id as string
    const defaultValuesSet = useRef(false)
    const theme = useTheme()
    const [isPreviewEnabled, setPreviewEnabled] = useState(false)

    const { data: task } = useGetOne<TTask, Error>(
        {
            resource: 'tasks',
            params: {
                id: taskId
            }
        },
        {
            enabled: !!session && !!taskId,
            refetchOnWindowFocus: false,
            initialData: () =>
                queryClient
                    .getQueryData<TGetListResponseData<TTask[]>>(
                        createResourceBaseQueryKey(EResourceBaseQueryKeyType.List, 'tasks'),
                        {
                            exact: false
                        }
                    )
                    ?.data.find(item => item.id === taskId)
        }
    )

    const pageTitle = `Task ${task?.title ? `"${task.title}"` : `#${taskId}`}`

    const updateMutation = useUpdateOne<TTask, AppwriteException>()

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TTask>({
        mode: 'onBlur',
        defaultValues: task,
        resolver: zodResolver(editValidationSchema)
    })

    useEffect(() => {
        if (!task) {
            return
        }

        if (defaultValuesSet.current) {
            return
        }

        defaultValuesSet.current = true

        reset(task)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task])

    const handleUpdate = useCallback(
        (formData: TTask) => {
            if (updateMutation.isLoading) {
                return
            }

            const { id: _, ...updatedTask } = formData

            updateMutation.mutate(
                {
                    resource: 'tasks',
                    params: {
                        id: taskId,
                        payload: {
                            ...updatedTask
                        }
                    }
                },
                {
                    onSuccess() {
                        router.push({
                            pathname: '/app/tasks'
                        })
                    }
                }
            )
        },
        [taskId, updateMutation, router]
    )

    return (
        <>
            <NextSeo title={pageTitle} />
            <AppPageAppBar title="My Tasks" />
            <AppFeatureBar>
                <Row gap={1} align="center" justify="center">
                    <Col css={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Text small weight="bold">
                            {task?.title}
                        </Text>
                    </Col>
                    <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            flat
                            size="xs"
                            onClick={() => {
                                setPreviewEnabled(current => !current)
                            }}
                        >
                            {/* TODO maybe some fancy icon? */}
                            {isPreviewEnabled ? 'Edit' : 'Preview'}
                        </Button>
                        <Spacer x={0.5} />
                        <Button
                            disabled={updateMutation.isLoading}
                            color="gradient"
                            size="xs"
                            iconRight={updateMutation.isLoading && <Loading color="currentColor" size="sm" />}
                            type="submit"
                            onClick={handleSubmit(handleUpdate)}
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
            </AppFeatureBar>
            <AppPageContainer>
                <Grid.Container
                    gap={1}
                    direction="column"
                    justify="center"
                    as="form"
                    css={{ margin: 0, width: 'auto' }}
                >
                    {!!updateMutation.error && (
                        <Grid sm={12}>
                            <Text h5 color="error">
                                Error: {updateMutation.error.message}
                            </Text>
                        </Grid>
                    )}
                    <Grid xs={12}>
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
                    </Grid>
                    <Grid xs={12}>
                        <Controller
                            control={control}
                            name="content"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <>
                                        <Col>
                                            <Text css={{ ml: '$2', mb: '$2', fontSize: '$xs' }} color="primary">
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
                                                    width="100%"
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

AppTaskPage.getLayout = (page: React.ReactElement) => {
    return <AppLayout>{page}</AppLayout>
}

export default AppTaskPage
