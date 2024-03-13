import mongoose, { Schema,model } from "mongoose";

const conversationSchema= new Schema({
  name:{
    type:String,
    required:[true,"please enter conversation name"],
    trim:true
  },
  isGroup:{
    type:Boolean,
    required:true,
    default:false
  },
  picture:{
  	type:String,
required:true	
  },
  users:[{
    type:mongoose.Types.ObjectId,
    ref:"User"
  }],
  latestMessage:{
    type:mongoose.Types.ObjectId,
    ref:"Message"
  },
  admin:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true});

const Conversation =   model("Conversation",conversationSchema);
export default Conversation;