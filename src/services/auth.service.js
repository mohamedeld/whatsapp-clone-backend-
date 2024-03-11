import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import validator from "validator";
import { User } from "../model/index.js";

export const createUser = async (userData)=>{
  const {name,email,password,picture,status} = userData;
  if(!name || !email || !password){
    throw createHttpError.BadRequest("Please fill all fields");
  }
  if(!validator.isLength(name,{
    min:2,
    max:16
  })){
    throw createHttpError.BadRequest("Please make sure your name between 2 and 16 characters..");
  }
  if(status){
    if(status.length > 64){
      throw createHttpError.BadRequest("Please make sure your status less than 64 characters");
    }
  }
  if(!validator.isEmail(email)){
    throw createHttpError.BadRequest("Please enter a valid email contains @");
  }
  const checkDB = await User.findOne({email});
  if(checkDB){
    throw createHttpError.Conflict("Please try again with a different account this email is already exists");
  }
  if(!validator.isLength(password,{
    min:6,
    max:128
  })){
    throw createHttpError.BadRequest("Please make sure your password between 6 and 128 characters..");
  }
  const user = await User.create({
    name,email,password,
    picture:picture || process.env.DEFAULT_PICTURE
    ,status:status || process.env.DEFAULT_STATUS
  })
  return user;
}

export const loginUser = async (email,password)=>{
  const user = await User.findOne({email}).lean();
  if(!user){
    throw createHttpError.NotFound("Email is not found please register first");
  }
  let passwordMatched = await bcrypt.compare(password,user.password);
  if(!passwordMatched){
    throw createHttpError.NotFound("Password is not correct");
  } 
  return user;
}