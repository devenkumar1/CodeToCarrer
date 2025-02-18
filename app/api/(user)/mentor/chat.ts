import { NextRequest, NextResponse } from "next/server";
import Chat from "@/models/chat.model";
import { randomUUID } from "crypto";
import User from "@/models/user.model";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  // const {userId}=reqBody;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = token.id!;
  if (!userId) {
    return NextResponse.json({ message: "invalid user " }, { status: 400 });
  }

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return NextResponse.json(
      { message: "invalid no such user" },
      { status: 400 }
    );
  }

  try {
    //create a newChat
    const randomName = randomUUID();
    const newChat = await Chat.create({
      name: randomName,
      messages: [],
      user: currentUser._id,
    });
    currentUser.AiMentorChats.push(newChat._id);
    await currentUser.save();
    await newChat.save();

    return NextResponse.json(
      { message: "chat successfully created" },
      { status: 200 }
    );
  } catch (error) {
    console.log("something went wrong in creating a chat", error);
    return NextResponse.json(
      { message: "error creating new chat" },
      { status: 500 }
    );
  }
}

 export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  //get all the user Aimentorchats
  const userId = token.id!;
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return NextResponse.json(
      { message: "invalid no such user" },
      { status: 400 }
    );
  }
  try {
    //getting all the chats and messages
    const allChats = await Chat.find({ user: currentUser._id }).populate(
      "messages"
    );
    console.log("all chats", allChats);

    return NextResponse.json(
      { allChats, message: "all chats fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in fetching all chats", error);
    return NextResponse.json(
      { message: "error in fetching all chats" },
      { status: 500 }
    );
  }
}
