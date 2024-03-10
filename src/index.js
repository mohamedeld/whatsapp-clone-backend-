import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import app from "./app.js";

dotenv.config();
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(mongoSanitize())
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({urlencoded:true}));
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({
  useTempFiles:true
}));
app.use(cors({
  origin:"http://localhost:3000"
}));
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
});