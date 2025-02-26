import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { CustomSession } from "../(user)/mentor/chat/route";
import { User } from "@/models";
import { connectDb } from "@/config/db.config";


export async function POST(req:NextRequest){
const session = await getServerSession(authOptions as any) as CustomSession;
if(!session){
    return NextResponse.json({message:"unauthorised"},{status:403});
}

const userId= session.user.id;
await connectDb();
try {
    const currentUser= await  User.findById(userId);
    return NextResponse.json({message:"user data fetched successfully",user:currentUser},{status:200});
} catch (error) {
    console.log("error getting in user details",error);
    return NextResponse.json({message:"error in User detals"},{status:500})
}

}