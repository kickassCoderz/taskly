import { KickassAdmin } from '@kickass-admin'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

import { themeProviderValues } from '../theme'

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <KickassAdmin>
            <NextThemeProvider defaultTheme="system" attribute="class" value={themeProviderValues}>
                <NextUIProvider>
                    <Component {...pageProps} />
                </NextUIProvider>
            </NextThemeProvider>
        </KickassAdmin>
    )
}

export default App
