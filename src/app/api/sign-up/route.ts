import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists and is verified",
                },
                { status: 400 }
            );
        }
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this Email",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();
        }
        //send verification email
        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        );
        if (!emailResponse) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email",
                },
                { status: 500 }
            );
        }
        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully. Please check your email for verification.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}
