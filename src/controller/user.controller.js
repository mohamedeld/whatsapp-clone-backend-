import { searchQueryUser } from "../services/user.service.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";


export const searchUsers = catchAsync(async (request,response,next)=>{
  const {keyword} = request.query;
  if(!keyword){
    return next(new AppError("please add a search term first"));
  }
  console.log(keyword)
  const users = await searchQueryUser(keyword);

  response.status(200).json({
    status:"success",
    message:"get search users",
    data:{
      users
    }
  })
})