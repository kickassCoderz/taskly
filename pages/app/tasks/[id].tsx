import { zodResolver } from '@hookform/resolvers/zod'
import { useGetOne, useUpdateOne } from '@kickass-admin'
import { Button, Col, Grid, Input, Loading, Row, Spacer, Text } from '@nextui-org/react'
import { AppwriteException } from 'appwrite'
import { AppFeatureBar, AppLayout, AppPageAppBar, AppPageContainer } from 'components'
import { useSessions } from 'hooks'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { TTask } from 'types'
import { editValidationSchema } from 'validationSchemas'

const AppTaskPage = () => {
    const session = useSessions()?.[0]
    const router = useRouter()
    const taskId = router.query.id as string
    const defaultValuesSet = useRef(false)

    const { data: task } = useGetOne<TTask, Error>(
        {
            resource: 'tasks',
            params: {
                id: taskId
            }
        },
        {
            enabled: !!session && !!taskId,
            refetchOnWindowFocus: false
        }
    )

    const pageTitle = `Task ${task?.title ? `"${task.title}"` : `#${taskId}`}`

    const updateMutation = useUpdateOne<TTask, AppwriteException>()

    const {
        register,
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
            console.log(formData)

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
            <AppPageAppBar title={pageTitle} />
            <AppFeatureBar>
                <Row gap={1} align="center" justify="center">
                    <Col css={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div>palceholder left</div>
                    </Col>
                    <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div>palceholder right</div>
                    </Col>
                </Row>
            </AppFeatureBar>
            <AppPageContainer>
                <Grid.Container gap={2} onSubmit={handleSubmit(handleUpdate)}>
                    <Grid as="form">
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
                        {!!updateMutation.error && (
                            <>
                                <Text h5 color="error">
                                    Error: {updateMutation.error.message}
                                </Text>
                                <Spacer y={1.2} />
                            </>
                        )}
                        <Button
                            disabled={updateMutation.isLoading}
                            iconRight={updateMutation.isLoading && <Loading color="currentColor" size="sm" />}
                            type="submit"
                            onSubmit={() => {
                                console.log('peder')
                            }}
                        >
                            Save
                        </Button>
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
