import { z } from 'zod'

const editValidationSchema = z.object({
    title: z.string().min(1, { message: 'Title is required!' }),
    content: z.string().optional()
})

export { editValidationSchema }
