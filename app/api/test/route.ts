import { NextRequest, NextResponse } from "next/server";
import { Roadmap } from "@/models";
import generateTest from "@/lib/generateAndStoreTest";

export async function POST(req:NextRequest){
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

generateTest(topicName);

return NextResponse.json({message:"test generation successfull"},{status:200});

}