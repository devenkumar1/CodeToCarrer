import { NextRequest, NextResponse } from "next/server";
import { CustomSession } from "../(user)/mentor/chat/route";
import { Roadmap } from "@/models";
import generateTest from "@/lib/generateAndStoreTest";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function POST(req:NextRequest){
        const session = await getServerSession(authOptions as any) as CustomSession;
    
        if (!session || !session.user?.id) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
    const userId = session.user.id;

    const reqBody=await req.json();



// const {roadmapId}=reqBody;
// if(!roadmapId){
//     return NextResponse.json({message:"error no roadmap id provided"},{status:402})
// }
// const roadmap=await Roadmap.findOne({_id:roadmapId});
// if(!roadmap){
//     return NextResponse.json({message:"error no roadmap found"},{status:404})
// }
// const topicName=roadmap.title;

const {topicName}=reqBody;
console.log("recieved topic name is ",topicName);

generateTest(topicName,userId);

return NextResponse.json({message:"test generation successfull"},{status:200});

}