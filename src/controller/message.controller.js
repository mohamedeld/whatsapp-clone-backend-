import { updatedLatestMessage } from "../services/conversation.service.js";
import { createNewMessage,getConvoMessages,populatedMessage } from "../services/message.service.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const sendMessage = catchAsync(async(request,response,next)=>{
  const userId = request.user._id;
  const {message,convoId,files} = request.body;
  if(!convoId){
    return next(new AppError("Please provide a conversation id and message body"));
  }
  const messageData = {
    sender:userId,
    message,
    conversation:convoId,
    files:files || []
  };
  let createMessage = await createNewMessage(messageData);
  let populateMessage = await populatedMessage(createMessage._id);
  await updatedLatestMessage(convoId,createMessage);
  response.status(200).json(populateMessage)
})

export const getMessage = catchAsync(async(request,response,next)=>{
  const convId = request.params.convId;
  if(!convId){
    return next(new AppError("Please add conversation id in headers"));
  }
  const messages = await getConvoMessages(convId);
  response.status(200).json(messages)
})