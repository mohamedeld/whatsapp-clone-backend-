import { User } from "../model/index.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
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
  // if (currentUser.passwordChangeAt) {
  //   const convertDateToTimeStamp = parseInt(currentUser.passwordChangeAt.getTime() / 1000,10);
  //   if(convertDateToTimeStamp> decoded.iat){
  //     response
  //       .status(401)
  //       .json({
  //         message: "the user change his password please login again",
  //       });
  //   }
  // }
  request.user = currentUser;
  next();

});