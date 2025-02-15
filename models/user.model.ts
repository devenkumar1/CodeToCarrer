import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },

    {
        timestamps: true
    }
)

// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

export const User = mongoose.models?.User ||mongoose.model<IUser>("User", userSchema);

export default User;
