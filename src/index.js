import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";
import SocketServer from "./SocketServer.js";
process.on('uncaughtException', (err) => {
  console.log('unhandler exception shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config();
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(mongoSanitize())




mongoose.connection.on("error",err=>{
  console.error("error with connected with database",err);
  process.exit(1);
})
if(process.env.NODE_ENV !== "production"){
  mongoose.set("debug",true);
}

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("database connected successfully");
}).catch(err=>{
  console.error("error with connected with database",err);
})
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
});

const io = new Server(server,{
  pingTimeout:60000,
  cors:{
    origin:process.env.CLIENT_ENDPOINT
  }
})
io.on("connection",(socket)=>{
  console.log(`socket io is connected successfully`);
  SocketServer(socket);
})

// error outside express
process.on('unhandledRejection', (error) => {
  console.log(`UnhandledRejection ${error}`);
  server.close(() => {  
    console.error('Shut down...');
    process.exit(1);
  });
});