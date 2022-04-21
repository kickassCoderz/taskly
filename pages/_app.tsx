import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { themeProviderValues } from '../theme'

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <NextThemeProvider defaultTheme="system" attribute="class" value={themeProviderValues}>
            <NextUIProvider>
                <Component {...pageProps} />
            </NextUIProvider>
        </NextThemeProvider>
    )
}

export default App
