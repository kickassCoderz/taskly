import { useState } from 'react'
import { QueryClient, QueryClientConfig, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { AuthServiceProvider, DataServiceProvider, RealtimeServiceProvider } from '../../contexts'
import { IAuthService, IDataService, IRealtimeService } from '../types'
export interface IKickassAdminProps {
    children: React.ReactNode
    queryClientInstance?: QueryClient
    queryClientConfig?: QueryClientConfig
    dataService?: IDataService
    authService?: IAuthService
    realtimeService?: IRealtimeService
}

const KickassAdmin = ({
    children,
    dataService,
    authService,
    realtimeService,
    queryClientInstance,
    queryClientConfig
}: IKickassAdminProps) => {
    const [queryClient] = useState(() => queryClientInstance || new QueryClient(queryClientConfig))

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <AuthServiceProvider authService={authService}>
                <DataServiceProvider dataService={dataService}>
                    <RealtimeServiceProvider realtimeService={realtimeService}>{children}</RealtimeServiceProvider>
                </DataServiceProvider>
            </AuthServiceProvider>
        </QueryClientProvider>
    )
}

export default KickassAdmin
