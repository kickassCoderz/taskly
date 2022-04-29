import { Appwrite } from 'appwrite'

const ENDPOINT_URL = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

if (!ENDPOINT_URL) {
    throw new Error('No Endpoint url provided for appwrite sdk')
}

if (!PROJECT_ID) {
    throw new Error('No Project id provided for appwrite sdk')
}

const appwriteService = new Appwrite().setEndpoint(ENDPOINT_URL).setProject(PROJECT_ID)

export { appwriteService }
