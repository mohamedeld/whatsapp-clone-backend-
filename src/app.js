import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import routes from "./routes/index.js";

import { globalError } from "./controller/globalErrorHandler.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({
  useTempFiles:true
}));
app.use(cors({
  origin:"http://localhost:3000"
}));

app.use("/api/v1",routes);  

app.use((request, response, next) => {
  response.status(404).json({
    message: 'Page Not Found',
  });
});


app.use(globalError);


export default app;