import createHttpError from "http-errors";
import { User } from "../model/index.js"

export const getUser =async (reveciverId)=>{
  const existedUser = await User.findById(reveciverId);
  if(!existedUser){
    throw createHttpError.BadRequest("this user is not exists");
  }
  return existedUser;
}

export const searchQueryUser = async(keyword,userId)=>{
  const users = await User.find({
    name:{$regex:keyword,$options:"i"}
  }).find({
    _id:{$ne:userId}
  });
  if(!users){
    throw createHttpError.BadRequest("no users found");
  }
  return users;
}