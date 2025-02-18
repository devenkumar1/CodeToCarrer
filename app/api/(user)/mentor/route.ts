import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import geminiMentorPrompt from "@/lib/geminiMentorPrompt";

export async function POST(req: NextRequest) {
  try{
  const reqBody= await req.json();
  const {userId,chatId,message}=reqBody;
  if(!userId || !chatId || !message){
    return NextResponse.json({message:"all fields are required"},{status:400});
  }

  const currentUser= await User.findById(userId);
  if(!currentUser){
    return NextResponse.json({message:"not a valid user"},{status:400});
  }
  const currentChat=await Chat.findById(chatId);
  if(!currentChat){
    return NextResponse.json({message:"invalid chatId"},{status:400});
  }
  //creating a new Message with user message 
 const newMessage= await Message.create({
  content:message,
  senderId:currentUser._id,
  chatId:currentChat._id
 });
 newMessage.save();

 //saving new created message in Current Chat
 currentChat.messages.push(newMessage._id);
  
 //getting updated Chat
 const updatedChat= await Chat.findById(chatId);
 const messagesArray= updatedChat?.messages;

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const prompt= geminiMentorPrompt(messagesArray!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent(prompt);
const responseText = result.response.text();
console.log("Raw response from the model:", responseText);
const jsonResponseText = responseText.replace(/```json|```/g, '').trim();
   // Try parsing the response text after removing Markdown formatting
   let parsedResult;
   try {
     parsedResult = JSON.parse(jsonResponseText);
   } catch (error) {
     console.error("Error parsing JSON:", error);
     return NextResponse.json({ error: "The response from the model was not valid JSON." });
   }
   //creating newmessage to save gemini response
   const newMessage2= await Message.create({
    content:parsedResult,
    receiverId:currentUser._id,
    chatId:currentChat._id
   });
   newMessage2.save();
   currentChat.messages.push(newMessage2._id);
   currentChat.save();
   return NextResponse.json({message:"message recieved by mentor"},{status:200});
   
  }
 catch (error) {
    console.log("Error occured in mentor route",error);
    return NextResponse.json({error:"couldn't send message"},{status:500})
}
}
