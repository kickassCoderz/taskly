import { AuthServiceProvider, DataServiceProvider, RealtimeServiceProvider } from '@kickass-admin'
import { NextUIProvider } from '@nextui-org/react'
import { BaseLayout } from 'components'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { authService } from 'services'

import { themeProviderValues } from '../theme'

const App = ({ Component, pageProps }: AppProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Hydrate state={pageProps?.dehydratedState}>
                <DataServiceProvider>
                    <AuthServiceProvider authService={authService}>
                        <RealtimeServiceProvider>
                            <NextThemeProvider defaultTheme="system" attribute="class" value={themeProviderValues}>
                                <NextUIProvider>
                                    <BaseLayout>
                                        <Component {...pageProps} />
                                    </BaseLayout>
                                </NextUIProvider>
                            </NextThemeProvider>
                        </RealtimeServiceProvider>
                    </AuthServiceProvider>
                </DataServiceProvider>
            </Hydrate>
        </QueryClientProvider>
    )
}

export default App
