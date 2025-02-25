import { CustomSession } from './../mentor/chat/route';
import { NextResponse,NextRequest } from "next/server";
import { Roadmap,User } from "@/models";
import { connectDb } from "@/config/db.config";
import { getServerSession } from "next-auth";
import { geminiRoadmapPrompt } from "@/lib/geminiRoadmapPrompt";
import authOptions from '@/lib/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";



export  async  function POST(req:NextRequest){
    await connectDb();
        const session = await getServerSession(authOptions as any) as CustomSession;
    
        if (!session || !session.user?.id) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        const userId = session.user.id;
       const reqBody= await req.json();
    const {skill,experience,learningPreference,expectedOutcome}=reqBody;
    if(!skill || !experience ||!learningPreference ||!expectedOutcome){
        return NextResponse.json({message:"all fields are mandatory"},{status:400});
    }
try {
    // console.log("user inputs from frontend",{skill,experience,learningPreference,expectedOutcome});
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ message: "Not a valid user" }, { status: 400 });
    }
        const apiKey = process.env.GEMINI_API_KEY!;
        const genAI = new GoogleGenerativeAI(apiKey);
        const prompt= geminiRoadmapPrompt({skill,experience,learningPreference,expectedOutcome});
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const cleanedResponseText = responseText.replace(/```json\n|\n```/g, '').trim();
        //  console.log("raw response from the gemini ",responseText);
         try {
            const parsedresult= await JSON.parse(cleanedResponseText);
            const RoadmapTitle=skill;
            const RoadmapSteps=parsedresult.roadmap;
            const Roadmapresources=parsedresult.resources;
            console.log(RoadmapTitle,RoadmapSteps,Roadmapresources);
            const newRoadmap= await Roadmap.create({
                title:RoadmapTitle,
                steps:RoadmapSteps,
                resources:Roadmapresources
            });
              currentUser.roadmaps.push(newRoadmap._id);
              await currentUser.save();
        //    console.log("new roadmap created suceessfully and added to user",newRoadmap);
         } catch (error) {
            console.log(error);
         }
        }catch(err){
            console.log("couldn't get  response from the gemini ");
        }

   return NextResponse.json({message:"Roadmap created succesfullly"},{status:200});
} catch (error) {
    console.log(error);
   return NextResponse.json({message:"error occured in Roadmap generation"},{status:500});
}

}
