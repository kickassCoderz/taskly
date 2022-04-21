import { Appwrite } from 'appwrite'
import { useState } from 'react'

let appwriteSDK: Appwrite

/**
 * Get Appwrite sdk instance
 *
 * @return {*}  {Appwrite}
 */
const useAppwrite = (): Appwrite => {
    const [sdk] = useState(() => {
        if (appwriteSDK) {
            return appwriteSDK
        }

        const sdk = new Appwrite()

        sdk.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string).setProject(
            process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string
        )

        // only memoize sdk on client side
        if (typeof window !== 'undefined') {
            appwriteSDK = sdk
        }

        return sdk
    })

    return sdk
}

export default useAppwrite
