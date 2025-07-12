import { z } from "zod";



export const SignupZod = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(12).regex(/[A-Z]/,"Password must contain atleast one uppercase").regex(/[0-9]/,"Password must contain at least one number").regex(/[!@#$%^&*(),.?":{}|<>]/,"Password must contain at least one special character"),
    username: z.string().min(3).max(10)
});

export const SigninZod = z.object({
    email: z.string().email(),
    password : z.string().min(6).max(12).regex(/[A-Z]/,"Password must contain atleast one uppercase").regex(/[0-9]/,"Password must contain at least one number").regex(/[!@#$%^&*(),.?":{}|<>]/,"Password must contain at least one special character"),
})