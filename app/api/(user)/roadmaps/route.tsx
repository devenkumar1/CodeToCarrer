import { NextResponse,NextRequest } from "next/server";
import { connectDb } from "@/config/db.config";
import { User,Roadmap } from "@/models";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { CustomSession } from "../mentor/chat/route";
import mongoose from "mongoose";



export async function GET(){
      await connectDb();
            const session = await getServerSession(authOptions as any) as CustomSession;
        
            if (!session || !session.user?.id) {
              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
        
            const userId = session.user.id;

            try {
                const user = await User.findById(userId).populate<{ roadmaps: mongoose.Types.ObjectId[] }>({
                  path: "roadmaps",
                });
            
                if (!user || !user.roadmaps) {
                  return NextResponse.json({ message: "No roadmaps found for this user" }, { status: 400 });
                }
            
                // Extract only the roadmaps and return them in the response
                return NextResponse.json({ message: "All roadmaps fetched", roadmaps: user.roadmaps }, { status: 200 });
              } catch (error) {
                console.log("Error fetching roadmaps", error);
                return NextResponse.json({ message: "Something went wrong while fetching roadmaps" }, { status: 500 });
              }

       



}