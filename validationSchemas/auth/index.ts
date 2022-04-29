import { z } from 'zod'

const loginValidationSchema = z.object({
    email: z.string().email({ message: 'Invalid email!' }),
    password: z.string().min(8, { message: 'Password must have at least 8 characters!' })
})

const registerValidationSchema = z.object({
    email: z.string().email({ message: 'Invalid email!' }),
    password: z.string().min(8, { message: 'Password must have at least 8 characters!' }),
    fullName: z.string().min(1, { message: 'Full name is required!' })
})

export { loginValidationSchema, registerValidationSchema }
