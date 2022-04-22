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

        // TODO authenticate github
        // https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks

        switch (req.method) {
            case 'POST': {
                // init ping is triggered when adding a webhook
                const isInit = !!req.body.zen

                if (isInit) {
                    return res.status(201).json({ message: 'ok' })
                }

                const action = req.body.action
                const issue = req.body.issue

                if (![action, issue].every(Boolean)) {
                    throwError('bad request', 400)
                }

                const existingTask = (
                    await appwriteDatabase.listDocuments('tasks', [Query.equal('providerId', issue.id.toString())])
                )?.documents?.[0]

                const task = {
                    ...existingTask,
                    title: issue.title,
                    content: issue.body,
                    link: issue.html_url,
                    status: issue.state,
                    providerId: issue.id.toString(),
                    provider: 'github'
                }

                const defaultPermissionsRead = [`user:${id}`]
                const defaultPermissionsWrite = [`user:${id}`]

                let result

                switch (action) {
                    case 'deleted':
                        if (!existingTask) {
                            throwError('not found', 404)
                        }

                        await appwriteDatabase.deleteDocument('tasks', existingTask.$id)

                        return res.status(204).json(null)
                    default:
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
            }
            default:
                throwError('method not allowed', 405)
        }
    } catch (error: any) {
        const statusCode = error.statusCode || 500

        console.error('[github][webhooks][error]', statusCode, error.message || 'unknown error')

        res.status(statusCode).json({ message: error.message })
    }
}

export default handler
