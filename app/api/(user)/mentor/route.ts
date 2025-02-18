import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import { randomUUID } from "crypto";
import Message from "@/models/message.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
try {
    const {
        userId,
        message,
        chatId,
      }: { userId: string; message: string; chatId?: string } = await req.json();
      
      if (!message || !userId) {
        return NextResponse.json(
          { error: "couldn't find message or user" },
          { status: 400 }
        );
      }
    
      const user = await User.findById({ userId });
      if (!user) {
        {
          return NextResponse.json(
            { error: "invalid user , unauthorised" },
            { status: 401 }
          );
        }
      }
      //create new chat if chatId is not provided
      if (!chatId) {
        const randomName = randomUUID();
        const Newchat = await Chat.create({
          name: randomName,
          user: user._id,
          messages: [],
        });
        Newchat.save();
        //after creating new chat, pushing it to the user's AiMentorChats array
        user.AiMentorChats?.push(Newchat._id);
        await user.save();
      }
      const chat = await Chat.findById({ chatId });
      if (!chat) {
        return NextResponse.json({ error: "couldn't find chat" }, { status: 400 });
      }
      const newMessage = await Message.create({
        senderId: user._id,
        content: message,
        chatId: chat._id,
      });
      //pushing the new message to the chat
      chat.messages.push(newMessage._id);
      await chat.save();
      const apiKey = process.env.GEMINI_API_KEY!;
      const genAI = new GoogleGenerativeAI(apiKey);
    
    
    
} catch (error) {
    console.log("Error occured in mentor route",error);
    return NextResponse.json({error:"couldn't send message"},{status:500})
}
}
