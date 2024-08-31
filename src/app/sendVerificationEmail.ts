import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { promises } from "dns";
import { messageSchema } from "@/schemas/messageSchema";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystry message | Verification Code",
            react: VerificationEmail({username, otp: verifyCode})
        })
        return {success: false, message: "Verification email sent successfully"}
    }catch(emailError){
        console.log("Error sending verification email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        }
    }
}