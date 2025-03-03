import { NextResponse,NextRequest } from "next/server";
import fetchAndStoreNews from "@/lib/FetchAndStoreNews";

export async function GET(req:NextRequest){
    try {
        fetchAndStoreNews();
        return NextResponse.json({message:"news fetched successfully"},{status:200});
    } catch (error) {
        console.log("error occured in updating latest news: ",error);
    }
} 