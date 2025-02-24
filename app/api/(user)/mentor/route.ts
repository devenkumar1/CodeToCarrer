import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiMentorPrompt } from '@/lib/geminiMentorPrompt';
import { CustomSession } from "./chat/route";
import authOptions from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Fetch session details
    const session = await getServerSession(authOptions as any) as CustomSession;

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const reqBody = await req.json();
    const { chatId, message } = reqBody;

    if (!userId || !chatId || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Fetch current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ message: "Not a valid user" }, { status: 400 });
    }

    // Fetch current chat
    const currentChat = await Chat.findById(chatId).populate('messages');  // Populate messages
    if (!currentChat) {
      return NextResponse.json({ message: "Invalid chatId" }, { status: 400 });
    }

    // Create a new message with the user's message
    const newMessage = await Message.create({
      content: message,
      senderId: currentUser._id,
      chatId: currentChat._id,
    });
    newMessage.save();
    console.log("New message created.");

    // Add the new message to the chat
    currentChat.messages.push(newMessage._id);
    console.log("Message saved in the chat.");

    // Fetch updated chat and messages
    const updatedChat = await Chat.findById(chatId).populate('messages');
    const messagesArray = updatedChat?.messages;

    // Extract the text content of each message for the prompt
    const chatHistory = messagesArray?.slice().map((msg: any) => 
      `${msg.senderId === currentUser._id  ? 'User' : 'AI'}: ${msg.content}`).join('\n') || '';
    console.log("this chats messages history is",chatHistory);
      const latestMessage=message;
      console.log("is this latest message",latestMessage);
    // Generate AI response using Gemini API
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = geminiMentorPrompt(chatHistory,latestMessage);  
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
      const result = await model.generateContent(prompt);
  
      // Get response safely
      const responseText = result?.response?.text?.() || "";
      // console.log("Raw response from the model:", responseText);
  
      // No need to parse if it's not JSON
      const geminiReply = responseText.trim() || "Sorry, I couldn't understand that.";
  
      // Save the Gemini response as a new message
      const newMessage2 = await Message.create({
          content: geminiReply,
          receiverId: currentUser._id,
          chatId: currentChat._id,
      });
  
      newMessage2.save();
      currentChat.messages.push(newMessage2._id);
      await currentChat.save();
      console.log("Gemini response saved in the chat.");
  
      return NextResponse.json({ message: "Message received by mentor" }, { status: 200 });
  
  } catch (error) {
      console.error("Error processing Gemini response:", error);
      return NextResponse.json({ error: "Failed to get a valid response from Gemini." }, { status: 500 });
  }

  
  }catch(error){
  console.log(error)
  }
}