import mongoose, { Schema, Document } from "mongoose";
import { Inria_Serif } from "next/font/google";

export interface Message extends Document {
    content: string;
    createAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});


const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9]+$/,
        minlength: 5,
        maxlength: 20,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/.+\@.+\..+/, "Please enter a valid email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [messageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default UserModel;
