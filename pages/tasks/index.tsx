import { useGetList } from '@kickass-admin'
import { TTask } from 'types'

const TasksPage = () => {
    const listQuery = useGetList<TTask[], unknown>({
        resource: 'tasks'
    })

    return <div>Tasks</div>
}

export default TasksPage
