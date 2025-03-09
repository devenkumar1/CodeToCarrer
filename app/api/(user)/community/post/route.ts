import { NextRequest,NextResponse } from "next/server";
import { Post, User } from "@/models";
import { IPost } from "@/models/post.model";

export async function POST(req:NextRequest){
    const reqBody= await req.json();
    const {title,description,userId,tags}=reqBody;
    console.log(title,description,userId,tags);
    try {
    const newPost= await Post.create<IPost>({
        user:userId,
        title:title,
        description:description,
        tags:tags
    }) 
    await newPost.save();   

    const currentUser=await User.findById(userId);
    currentUser.questionsAsked.push(newPost._id);
    await currentUser.save();
    return NextResponse.json({message:"post created successfully"},{status:201});
    } catch (error) {
        console.log("error occurred while creating a post",error);
        return NextResponse.json({message:"error occured while creating a post"},{status:500});
    }


}

export async function GET(req:NextRequest){
    try {
        const allPost= await Post.find();
        return NextResponse.json({message:"fetched all posts: ",allPost},{status:200});
    } catch (error) {
        console.log("error getting all the post") 
    }

}