import { CssBaseline } from '@nextui-org/react'
import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class Document extends NextDocument {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await NextDocument.getInitialProps(ctx)

        return initialProps
    }

    render() {
        return (
            <Html>
                <Head>{CssBaseline.flush()}</Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default Document
