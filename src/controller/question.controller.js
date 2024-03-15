import { createNewQuestion, deleteQuestionById, getAllQuestions, getQuestionById, updateQuestionById } from "../services/question.service.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const createQuestion = catchAsync(async(request,response,next)=>{
  const userId = request.user._id;
  const {title,description} = request.body;
  if(!userId){
    return next(new AppError("please login first"));
  }
  const questionData = {
    title,
    description,
    user:userId
  }
  const newQuestion = await createNewQuestion(questionData);
  response.status(200).json(newQuestion)
})
export const getQuestions = catchAsync(async(request,response,next)=>{
  const questions = await getAllQuestions();
  response.status(200).json(questions)
})
export const getQuestion = catchAsync(async(request,response,next)=>{
  const questionId = request.params.id;
  if(!questionId){
    return next(new AppError("can not find question id"));
  }
  const question = await getQuestionById(questionId)
  response.status(200).json(question)
})
export const updateQuestion = catchAsync(async(request,response,next)=>{
  const questionId = request.params.id;
  const userId = request.user._id;
  const {title,description} = request.body;
  if(!userId){
    return next(new AppError("please login first"));
  }
  const questionData = {
    title,
    description
  }
  if(!questionId){
    return next(new AppError("can not find question id"));
  }
  const question = await updateQuestionById(questionId,questionData)
  response.status(200).json(question)
})
export const deleteQuestion = catchAsync(async(request,response,next)=>{
  const questionId = request.params.id;
  if(!questionId){
    return next(new AppError("can not find question id"));
  }
  const question = await deleteQuestionById(questionId)
  response.status(200).json({
    status:"success",
    message:"deleted successfully"
    
  })
})