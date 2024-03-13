import createHttpError from "http-errors";
import { User } from "../model/index.js"

export const getUser =async (reveciverId)=>{
  const existedUser = await User.findById(reveciverId);
  if(!existedUser){
    throw createHttpError.BadRequest("this user is not exists");
  }
  return existedUser;
}