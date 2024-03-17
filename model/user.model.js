import {Schema,model} from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new Schema({
  name:{
    type:String,
    trim:true,
    required:[true,"Please enter your name"]
  },
  email:{
    type:String,
    required:[true,"email address is required"],
    unique:[true,"this email is already exists"],
    lowercase:true,
    validate:[
      validator.isEmail,
      "please provide a valid email address"
    ]
  },
  role:{
    type:String,
    default:"user"
  },
  picture:{
    type:String,
    default:"https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png",
  },
  status:{
    type:String,
    default:"Hey there! am using whatsapp"
  },
  password:{
    type:String,
    required:[true,"Please provide your password"],
    minLength:[6,"please make sure your password long"],
    maxLength:[128,"please make sure your password less than 128 chars"]
  }
},{timestamps:true});

userSchema.pre('save',async function(next){
  try{
    if(this.isNew){
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(this.password,salt);
      this.password = hashPassword;
    }
    next();
  }catch(err){
    next(err);
  }
})

export const User =  model("User",userSchema);
