import { z } from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .max(300, "Message content can't be longer than 1000 characters")
})