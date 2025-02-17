import mongoose from 'mongoose'

interface IChat{
     _id?: mongoose.Types.ObjectId;
     name:String;
     messages:[{
          message:mongoose.Schema.Types.ObjectId;
     }];
     user:mongoose.Types.ObjectId;
} 

const chatSchema: mongoose.Schema<IChat> = new mongoose.Schema({
     name:{
          type:String,
          required:true
     },
     messages:[{
       message:mongoose.Schema.Types.ObjectId,
       required:true   
     }],
     user:{
          type:mongoose.Schema.Types.ObjectId,
          required:true
     }

},{timestamps:true})

const Chat = mongoose.model<IChat>("Chat",chatSchema)

export default Chat;

