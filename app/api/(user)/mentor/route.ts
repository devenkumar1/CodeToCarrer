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
    const currentChat = await Chat.findById(chatId);
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
    const updatedChat = await Chat.findById(chatId);
    const messagesArray = updatedChat?.messages;

    // Generate AI response using Gemini API
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = geminiMentorPrompt(messagesArray!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    // Get the raw response and clean it
    const responseText = result.response.text();
    console.log("Raw response from the model:", responseText);

    // Check if the response is an error message from the model (non-JSON)
    if (responseText && !responseText.trim().startsWith('{')) {
      console.log("Non-JSON response received:", responseText);
      // Return a meaningful error to the user
      return NextResponse.json({ error: "The response from the model is not in the expected format." }, { status: 400 });
    }

    // Try parsing the cleaned response text to ensure valid JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json({ error: "The response from the model was not valid JSON." }, { status: 500 });
    }

    // Extract the final response content from parsed result
    const geminiReply = parsedResult?.response || "Sorry, I couldn't understand that.";

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

    // Respond to the client
    return NextResponse.json({ message: "Message received by mentor" }, { status: 200 });

  } catch (error) {
    console.log("Error occurred in mentor route:", error);
    return NextResponse.json({ error: "Couldn't send message" }, { status: 500 });
  }
}
