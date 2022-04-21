import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { themeProviderValues } from '../theme'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const App = ({ Component, pageProps }: AppProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <NextThemeProvider defaultTheme="system" attribute="class" value={themeProviderValues}>
            <NextUIProvider>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </NextUIProvider>
        </NextThemeProvider>
    )
}

export default App
