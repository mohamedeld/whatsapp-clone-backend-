import createHttpError from "http-errors";
import { Conversation, User } from "../model/index.js";

export const doesConversationExist = async (senderId, receiverId) => {
  let conversations = await Conversation.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
    ]
  }).populate("users","-password").populate("latestMessage");
  if(!conversations){
    throw createHttpError.BadRequest("Oops, something went wrong");
  }
  conversations = await User.populate(conversations,{
    path:"latestMessage.sender",
    select:"name email picture status"
  })

  return conversations[0];
} 

export const createConversation = async(data)=>{
  const newConversation = await Conversation.create(data);
  if(!newConversation){
    throw createHttpError.BadRequest("Something went wrong");
  }
  return newConversation;
}

export const populateConversation = async(id,fieldsToPopulate,fieldsToRemove)=>{
  const populatedConv = await Conversation.findOne({_id:id}).populate(fieldsToPopulate,fieldsToRemove);
  if(!populatedConv){
    throw createHttpError.BadRequest("Something went wrong");
  }
  return populatedConv;
}

export const getUserConversations = async (user_id) => {
  let conversations;
  await Conversation.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((err) => {
      console.error("Error in getUserConversations:", err);
      throw createHttpError.BadRequest("Oops...Something went wrong !");
    });
  return conversations;
};

export const updatedLatestMessage = async (convoId,newMessage)=>{
  const updatedConversation = await Conversation.findByIdAndUpdate(convoId,{
    lastestMessage:newMessage
  },{new:true});
  if(!updatedConversation){
    throw createHttpError.BadRequest("something went wrong please provider conversation id");
  }
  return updatedConversation;
}