import createHttpError from "http-errors";
import {Conversation, Message} from "../model/index.js";


export const createNewMessage = async(messageData)=>{
  const newMessage = await Message.create(messageData);
  if(!newMessage){
    throw createHttpError.BadRequest("something went wrong");
  }
  return newMessage;
}

export const populatedMessage = async(messageId)=>{
  let message = await Message.findById(messageId).populate({
    path:"sender",
    select:"name picture",
    model:"User"
  }).populate({
    path:"conversation",
    select:"name isGroup users picture",
    model:"Conversation",
    populate:{
      path:"users",
      select:"name email picture status",
      model:"User"
    }
  })
  if(!message){
    throw createHttpError.BadRequest("something went wrong");
  }
  return message;
}

export const getConvoMessages = async (convId)=>{
  const messages = await Message.find({conversation:convId}).populate("sender","name picture email status").populate("conversation");
  if(!messages){
    throw createHttpError.BadRequest("something went wrong");
  }
  return messages;
}