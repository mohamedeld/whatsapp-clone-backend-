import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { createUser, loginUser } from "../services/auth.service.js";
import { response } from "express";
import createHttpError from "http-errors";
import { User } from "../model/index.js";
export const register = async (request, response, next) => {
try {
  const { name, email, password, picture, status } = request.body;
  // generate new user
  console.log("acitve ", process.env.JWT_SECRET_KEY);
  console.log("tef ",process.env.REFRESH_SECRET_KEY)
  const newUser = await createUser({ name, email, password, picture, status });
  // generate token for user
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 * 90 });
  
  // generate refresh token
  const refToken =  jwt.sign({ userId: newUser._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: 60 * 60 * 24 * 90 });
  // refresh token
  response.cookie("refreshtoken", refToken,{
    httpOnly:true,
    path:"/api/v1/auth/refreshtoken",
    maxAge:24*60*60*90 // 30days
  }); 
  
  // send json response
  response.status(201).json({
    status: "success",
    message: "added sucessfully",
    data: {
      user: {
_id:newUser._id,
name:newUser.name,
email:newUser.email,
picture:newUser.picture,
status:newUser.status,
role:newUser.role,
password:newUser.password,
token
},
    }
  })
}
catch (err) {
  next(err);
}
}
export const login = catchAsync(async (request, response, next) => {
const {email,password} = request.body;
const user = await loginUser(email,password);
// generate token for user
const token =  jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 * 90 });
    
// generate refresh token
const refToken =  jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: 60 * 60 * 24 * 90 });
// refresh token
response.cookie("refreshtoken", refToken,{
  httpOnly:true,
  path:"/api/v1/auth/refreshtoken",
  maxAge:30*24*60*60*1000 // 30days
}); 
response.status(200).json({
  status: "success",
  message: "login successully sucessfully",
  data: {
    user: {
_id:user._id,
name:user.name,
email:user.email,
picture:user.picture,
status:user.status,
role:user.role,
password:user.password,
token
},
  }
})
})
export const logout = catchAsync(async (request, response, next) => {
  response.clearCookie("refreshtoken",{
    path:"/api/v1/auth/refreshtoken",
  })
  response.status(201).json({
    status: "success",
    message:"logout successfully"
  })
})
export const refreshToken = async (request, response, next) => {
  try{
    // console.log(request.cookies)
  const refreshtoken = request.cookies.refreshtoken;
  if(!refreshtoken){
    throw createHttpError.Unauthorized("Please login first...");
  }
  const check = await jwt.verify(refreshtoken,process.env.REFRESH_SECRET_KEY);
  // console.log(check)
  const user = await User.findById(check.userId);
  if(!user){
    throw createHttpError.BadRequest("please fill all fields");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '90d' });
  response.status(201).json({
    status: "success",
    message: "added sucessfully",
    data: {
      user: {
	_id:newUser._id,
	name:newUser.name,
	email:newUser.email,
	picture:newUser.picture,
	status:newUser.status,
  role:newUser.role,
	password:newUser.password,
	token
	},
    }
  })
  } catch(err){
    next(err);
  }
}


