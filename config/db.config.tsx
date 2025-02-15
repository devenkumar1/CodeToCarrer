import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("please provide MongoDB URI in env variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, Promise: null };
}

export const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.Promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };
        cached.Promise = mongoose.connect(MONGODB_URI, opts)
            .then(() => {
                console.log("Database connected successfully");
                return mongoose.connection;
            });
    }

    try {
        cached.conn = await cached.Promise;
    } catch (error) {
        cached.Promise = null;
        throw error;
    }

    return cached.conn;
}

