import { searchQueryUser } from "../services/user.service.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";


export const searchUsers = catchAsync(async (request,response,next)=>{
  const {keyword} = request.query;
  const userId = request.user._id;
  if(!userId){
    return next(new AppError("please user does not exist"));
  }
  if(!keyword){
    return next(new AppError("please add a search term first"));
  }
  console.log(keyword)
  const users = await searchQueryUser(keyword,userId);

  response.status(200).json({
    status:"success",
    message:"get search users",
    data:{
      users
    }
  })
})