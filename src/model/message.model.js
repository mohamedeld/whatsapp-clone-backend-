import mongoose, { Schema,model } from "mongoose";

const messageSchema= new Schema({
  sender:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  message:{
    type:String,
    trim:true
  },
  conversation:{
    type:mongoose.Types.ObjectId,
    ref:"Conversation"
  },
  files:[]
},{timestamps:true});

const Message =   model("Message",messageSchema);
export default Message;