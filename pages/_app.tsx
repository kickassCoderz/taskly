import { AuthServiceProvider, DataServiceProvider, RealtimeServiceProvider } from '@kickass-admin'
import { NextUIProvider } from '@nextui-org/react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { authService, dataService, realtimeService } from 'services'

import { themeProviderValues } from '../theme'

type TNextPageWithLayout = NextPage & {
    getLayout?: (_page: React.ReactElement) => JSX.Element
}

type TAppPropsWithLayout = AppProps & {
    Component: TNextPageWithLayout
}

const App = ({ Component, pageProps }: TAppPropsWithLayout) => {
    const [queryClient] = useState(() => new QueryClient())

    const getLayout = Component.getLayout ?? (page => page)

    return (
        <>
            <DefaultSeo defaultTitle="Taskly" titleTemplate="Taskly | %s" description="Organize your tasks at ease!" />
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools position="bottom-right" />
                <Hydrate state={pageProps?.dehydratedState}>
                    <DataServiceProvider dataService={dataService}>
                        <AuthServiceProvider authService={authService}>
                            <RealtimeServiceProvider realtimeService={realtimeService}>
                                <NextThemeProvider defaultTheme="system" attribute="class" value={themeProviderValues}>
                                    <NextUIProvider>{getLayout(<Component {...pageProps} />)}</NextUIProvider>
                                </NextThemeProvider>
                            </RealtimeServiceProvider>
                        </AuthServiceProvider>
                    </DataServiceProvider>
                </Hydrate>
            </QueryClientProvider>
        </>
    )
}

export default App
