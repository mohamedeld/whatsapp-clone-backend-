import mongoose,{ Schema,model } from "mongoose";

const questionSchema = new Schema({
  title:{
    type:String,
    required:[true,'please enter question title'],
    trim:true
  },
  description:{
    type:String,
    required:[true,'please enter question title'],
  },
  user:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true});

const Question = model("Question",questionSchema);
export default Question;