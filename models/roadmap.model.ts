import mongoose from "mongoose";
interface IRoadmap{
    _id ?:mongoose.Types.ObjectId;
    title:string;
    steps:string[];
    resources:string[];
}

const roadMapSchema:mongoose.Schema<IRoadmap> = new mongoose.Schema({
    title:{
        type:String,
    },
    steps:{
        type:[String],
    },
    resources:{
        type:[String],
    }
})

const Roadmap= mongoose.models.Roadmap || mongoose.model<IRoadmap>("Roadmap",roadMapSchema);
export default Roadmap;