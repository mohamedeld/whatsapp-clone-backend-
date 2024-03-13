import createHttpError from "http-errors";
import { Question } from "../model/index.js";


export const createNewQuestion = async (questionData)=>{
  const newQuestion = await Question.create(questionData);
  if(!newQuestion){
    throw createHttpError.BadRequest("something went wrong");
  }
  return newQuestion;
}

export const getAllQuestions = async ()=>{
  const questions = await Question.find({}).populate("user","name");
  if(!questions){
    throw createHttpError.BadRequest("something went wrong");
  }
  return questions;
}
export const getQuestionById = async (questionId)=>{
  const question = await Question.findById(questionId).populate("user","name");
  if(!question){
    throw createHttpError.BadRequest("something went wrong");
  }
  return question;
}
export const updateQuestionById = async (questionId,questionData)=>{
  const question = await Question.findByIdAndUpdate(questionId,questionData,{new:true}).populate("user","name");
  if(!question){
    throw createHttpError.BadRequest("something went wrong");
  }
  return question;
}
export const QuestionByIdAndUpdate = async (questionId,questionData)=>{
  const question = await Question.findByIdAndUpdate(questionId,questionData,{new:true}).populate("user","name");
  if(!question){
    throw createHttpError.BadRequest("something went wrong");
  }
  return question;
}

export const deleteQuestionById = async (questionId)=>{
  const question = await Question.findByIdAndDelete(questionId);
  if(!question){
    throw createHttpError.BadRequest("something went wrong");
  }
  return question;
}