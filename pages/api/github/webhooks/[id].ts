import { NextApiRequest, NextApiResponse } from 'next'
import { Client, Database, Models } from 'node-appwrite'

const appwriteClient = new Client()
const appwriteDatabse = new Database(appwriteClient)

appwriteClient
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string)

const throwError = (message: string, statusCode = 500) => {
    const error = new Error(message) as any
    error.statusCode = statusCode

    throw error
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query

        if (!id) {
            throwError('bad request', 403)
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

                const issue = req.body.issue

                if (!issue) {
                    throwError('bad request', 403)
                }

                const task = {
                    title: issue.title,
                    content: issue.body,
                    link: issue.html_url,
                    status: 'open',
                    providerId: issue.id.toString()
                }

                const result = await appwriteDatabse.createDocument<
                    Models.Document & {
                        id: string
                        content: string
                        url: string
                        status: string
                        providerId: string
                    }
                >('tasks', 'unique()', task, [`user:${id}`], [`user:${id}`])

                return res.status(201).json(result)
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
