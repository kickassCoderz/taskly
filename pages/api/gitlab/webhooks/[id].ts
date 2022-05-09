import { NextApiRequest, NextApiResponse } from 'next'
import { Client, Database, Models, Query } from 'node-appwrite'

const appwriteClient = new Client()
const appwriteDatabase = new Database(appwriteClient)

appwriteClient
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string)

const throwError = (message: string, statusCode = 500) => {
    const error = new Error(message) as any
    error.statusCode = statusCode

    throw error
}

type Task = Models.Document & {
    id: string
    content: string
    url: string
    status: string
    providerId: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query

        if (!id) {
            throwError('bad request', 400)
        }

        const defaultPermissionsRead = [`user:${id}`]
        const defaultPermissionsWrite = [`user:${id}`]

        // TODO authenticate gitlab
        // https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#validate-payloads-by-using-a-secret-token

        switch (req.method) {
            case 'POST': {
                const event_type = req.body.event_type

                if (event_type !== 'issue') {
                    throwError('bad request', 400)
                }

                const action = req.body.object_attributes?.action
                const issue = req.body.object_attributes

                if (![action, issue].every(Boolean)) {
                    throwError('bad request', 400)
                }

                const existingTask: Models.Document | undefined = (
                    await appwriteDatabase.listDocuments('tasks', [Query.equal('providerId', issue.id.toString())])
                )?.documents?.find(item => {
                    const isOwnedByUser =
                        item.$read.includes(defaultPermissionsRead[0]) &&
                        item.$write.includes(defaultPermissionsWrite[0])

                    return isOwnedByUser
                })

                const task = {
                    ...existingTask,
                    title: issue.title,
                    content: issue.description || '',
                    link: issue.url,
                    status: issue.state,
                    providerId: issue.id.toString(),
                    provider: 'gitlab'
                }

                let result

                if (existingTask) {
                    result = await appwriteDatabase.updateDocument(
                        'tasks',
                        existingTask.$id,
                        task,
                        defaultPermissionsRead,
                        defaultPermissionsWrite
                    )
                } else {
                    result = await appwriteDatabase.createDocument<Task>(
                        'tasks',
                        'unique()',
                        task,
                        defaultPermissionsRead,
                        defaultPermissionsWrite
                    )
                }

                return res.status(201).json(result)
            }
            default:
                throwError('method not allowed', 405)
        }
    } catch (error: any) {
        const statusCode = error.statusCode || 500

        console.error('[gitlab][webhooks][error]', statusCode, error.message || 'unknown error')

        res.status(statusCode).json({ message: error.message })
    }
}

export default handler
