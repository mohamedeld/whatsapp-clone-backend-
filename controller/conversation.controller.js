import createHttpError from "http-errors";
import catchAsync from "../utils/catchAsync.js";
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js";
import { User } from "../model/user.model.js";
import { getUser } from "../services/user.service.js";

export const CreateOpenConversation = catchAsync(async(request,response,next)=>{
  const senderId = request.user._id;
  const {recevierId} = request.body;
  if(!recevierId){
    throw createHttpError.BadRequest("Something went wrong")
  }
  // const receiver = await getUser(recevierId);
  
  const existedConversation = await doesConversationExist(senderId,recevierId);
  if(existedConversation){ 
    response.status(200).json(existedConversation)
  }else{
    let conversationData = {
      name:"conversation name",
      isGroup:false,
      picture:"conversation picture",
      users:[senderId,recevierId],
      
    }
   
    const newConv = await createConversation(conversationData);
    const populateConv = await populateConversation(newConv._id,"users","-password")
    response.status(200).json(populateConv)
  }
 
});

export const getConversations = async(request,response,next)=>{
  try{
    const user_id = request.user._id;
    const conversations = await getUserConversations(user_id);
    response.status(200).json(conversations)
  }catch(err){
    next(err);
  }
}