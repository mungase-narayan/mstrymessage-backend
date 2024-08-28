import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username can't be longer than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain alphanumeric characters and numbers");


export const signUpScheme = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})