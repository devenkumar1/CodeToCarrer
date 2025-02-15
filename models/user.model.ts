import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the IUser interface
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string; // Password is optional for OAuth users
  role?: string;
  provider?: string; // Store the provider (Google, GitHub, etc.)
  providerId?: string; // Store the provider's unique user ID (e.g., Google/GitHub user ID)
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the user schema
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Make password optional for OAuth users
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: false,
    },
    providerId: {
      type: String,
      required: false, // Store the OAuth provider's user ID
    },
  },
  {
    timestamps: true,
  }
);


// Export the model
export const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
export default User;
