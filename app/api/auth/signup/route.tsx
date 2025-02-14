import  bcrypt  from 'bcryptjs';
import { NextResponse, NextRequest} from "next/server";
import { connectDb } from '@/config/db.config';
import User from '@/models/user.model';

export async function POST(req:NextRequest){

    try {
        const {email,password,name}= await req.json();
        if(!email || !password || !name){
            return NextResponse.json({message:"all fields are required"},{status:400});
        }
         await connectDb();
         const user=await User.findOne({email});
         if(user){
            return NextResponse.json({message:"user already exists"},{status:400});
         }
         const salt = await bcrypt.genSalt(10);
         const hashedPassword=await bcrypt.hash(password,salt);
         const newUser=new User({
            email,
            password:hashedPassword,
            name,
         });
         await newUser.save();
         return NextResponse.json({message:"user registered successfully"},{status:201});
    } catch (error) {
        console.log("error in user signup",error);
        return NextResponse.json({message:"something went wrong"},{status:500});
    }


}










