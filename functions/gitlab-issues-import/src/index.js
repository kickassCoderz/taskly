const sdk = require('node-appwrite')
const fetch = require('node-fetch')
const { setTimeout: setTimeoutPromise } = require('timers/promises')

const throwError = (message, statusCode = 500) => {
    const error = new Error(message)
    error.statusCode = statusCode

    throw error
}

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'env' - object with environment variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async (req, res) => {
    try {
        const client = new sdk.Client()

        const database = new sdk.Database(client)

        if (!req.env['APPWRITE_FUNCTION_ENDPOINT'] || !req.env['APPWRITE_FUNCTION_API_KEY']) {
            console.warn('Environment variables are not set. Function cannot use Appwrite SDK.')

            throwError('env not set', 500)
        } else {
            client
                .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
                .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
                .setKey(req.env['APPWRITE_FUNCTION_API_KEY'])
                .setSelfSigned(true)
        }

        const payload = JSON.parse(req.payload)

        if (!payload.webhook.$id) {
            throwError('bad request', 400)
        }

        const webhook = await database.getDocument('webhooks', payload.webhook.$id)

        if (!webhook) {
            throwError('webhook not found', 404)
        }

        const providerAccessToken = payload.pT

        if (!providerAccessToken) {
            throwError('unauthorized', 401)
        }

        let issues = []
        let page = 1

        while (true) {
            const issues_page = await fetch(
                `https://gitlab.com/api/v4/projects//${webhook.resourceId}/issues?page=${page}&per_page=100&state=opened`,
                {
                    method: 'GET',
                    headers: { authorization: `Bearer ${providerAccessToken}` }
                }
            ).then(res => res.json())

            if (issues_page.length === 0) {
                break
            }

            issues = [...issues, ...issues_page]
            page += 1
        }

        let created = 0
        let updated = 0
        let errors = []

        for (const issue of issues) {
            const existingTask = (
                await database.listDocuments('tasks', [sdk.Query.equal('providerId', issue.id.toString())])
            )?.documents?.[0]

            const task = {
                ...existingTask,
                title: issue.title,
                content: issue.description || '',
                link: issue.web_url,
                status: issue.state,
                providerId: issue.id.toString(),
                provider: 'gitlab'
            }

            const defaultPermissionsRead = [`user:${webhook.userId}`]
            const defaultPermissionsWrite = [`user:${webhook.userId}`]

            if (existingTask) {
                await database
                    .updateDocument('tasks', existingTask.$id, task, defaultPermissionsRead, defaultPermissionsWrite)
                    .then(() => {
                        updated += 1
                    })
                    .catch(error => {
                        console.error('issue', task.providerId, error.message)

                        errors.push({ providerId: task.providerId, error: error.message })
                    })
            } else {
                await database
                    .createDocument('tasks', 'unique()', task, defaultPermissionsRead, defaultPermissionsWrite)
                    .then(() => {
                        created += 1
                    })
                    .catch(error => {
                        console.error('issue', task.providerId, error.message)

                        errors.push({ providerId: task.providerId, error: error.message })
                    })
            }

            // TOOD just to avoid rate limit, in future job should check headers and retry accordingly
            // https://appwrite.io/docs/rate-limits
            await setTimeoutPromise(500)
        }

        res.json(
            {
                webhookId: webhook.$id,
                created,
                updated,
                errors
            },
            201
        )
    } catch (error) {
        const statusCode = error.statusCode || 500

        res.json({ statusCode, message: error.message }, statusCode)
    }
}
