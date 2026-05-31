import z from "zod";

export const registerSchema =  z.object({
    name:  z.string().min(2).max(120),
    email: z.email(),
    password: z.string().min(8).max(100)

})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(100)
})

export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>