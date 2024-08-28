import { z } from "zod";

export const verifyCode = z.object({
    code: z.string().min(6, "Verify Code must be at least 6 characters").max(6, "Verify Code must be exactly 6 characters"),
})