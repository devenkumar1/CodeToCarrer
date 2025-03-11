import { NextResponse,NextRequest } from "next/server";
import { News } from "@/models";
import { connectDb } from "@/config/db.config";


export async function GET(req:NextRequest){
await connectDb();
try {
   const allNews=await News.find({}).sort({publishedAt:-1}).lean();
//    console.log(allNews);
   return NextResponse.json({message:"news fetched successfully",allNews:allNews},{status:200});
} catch (error) {
    console.log("errror occured in fetching news from db",error);
    return NextResponse.json({message:"news fetching failed"},{status:400});
}

}