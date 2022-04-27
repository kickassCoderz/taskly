import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { AuthServiceProvider, DataServiceProvider, RealtimeServiceProvider } from '../../contexts'
import { IAuthService, IDataService, IRealtimeService } from '../types'
export interface IKickassAdminProps {
    children: React.ReactNode
    dataService?: IDataService
    authService?: IAuthService
    realtimeService?: IRealtimeService
}

const KickassAdmin = ({ children, dataService, authService, realtimeService }: IKickassAdminProps) => {
    const queryClient = new QueryClient()

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
