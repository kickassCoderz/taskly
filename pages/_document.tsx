import NextDocument, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { CssBaseline } from '@nextui-org/react'

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
