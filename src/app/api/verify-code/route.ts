import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request){
    await dbConnect();

    try {

        const { username, code} = await request.json();
        const decodedUsername = decodeURIComponent( username );
        const user = await UserModel.findOne({ username: decodedUsername });

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found",
                }, {status: 500}
            )
        }

        const  isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "User Verified Successfully",
                }, {status: 200}
            );
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has  expired, please signup again to get a new one"
                }, {status: 400}
            );
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification Code"
                }, {status: 400}
            );
        }

    } catch (error) {
        console.error("Error verifying code", error);
        return Response.json({
                success: false,
                message: "Error verifying code"},{status: 500,}
        );
    }
}