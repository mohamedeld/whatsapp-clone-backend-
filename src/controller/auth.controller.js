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
    const newUser = await createUser({ name, email, password, picture, status });
    // generate token for user
    const token = await jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_TIME });
    
    // generate refresh token
    const refToken = await jwt.sign({ userId: newUser._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_EXPIRES_TIME });
    // refresh token
    response.cookie("refreshtoken", refToken,{
      httpOnly:true,
      path:"/api/v1/auth/refreshtoken",
      maxAge:30*24*60*60*1000 // 30days
    }); 
    
    // send json response
    response.status(201).json({
      status: "success",
      message: "added sucessfully",
      data: {
        user: newUser,
        token
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
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_TIME });
      
  // generate refresh token
  const refToken = await jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_EXPIRES_TIME });
  // refresh token
  response.cookie("refreshtoken", refToken,{
    httpOnly:true,
    path:"/api/v1/auth/refreshtoken",
    maxAge:30*24*60*60*1000 // 30days
  }); 
  response.status(201).json({
    status: "success",
    message: "login successully sucessfully",
    data: {
      user,token
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
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_TIME });
  response.status(201).json({
    status: "success",
    message: "added sucessfully",
    data: {
      user,
      token
    }
  })
  } catch(err){
    next(err);
  }
}


export const protect = catchAsync(async (request,response,next)=>{
  
  
  let token;
  if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
    token = request.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new Error("access denied")
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  const currentUser = await User.findById(decoded.userId);
  if(!currentUser){
    throw new Error(
      "the user that belong to this token does no longer exist"
    );
  }
  if (currentUser.passwordChangeAt) {
    const convertDateToTimeStamp = parseInt(currentUser.passwordChangeAt.getTime() / 1000,10);
    if(convertDateToTimeStamp> decoded.iat){
      response
        .status(401)
        .json({
          message: "the user change his password please login again",
        });
    }
  }
  request.user = currentUser;
  next();

});