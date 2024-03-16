import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import { createQuestion,getQuestion,getQuestions,updateQuestion,deleteQuestion } from "../controller/question.controller.js";
import protectRoutes from "../utils/protectRoutes.js";
const router = express.Router();


router.route("/").get(protect,protectRoutes("admin"),getQuestions).post(protect,createQuestion);

router.route("/:id").get(protect,getQuestion).patch(protect,updateQuestion).delete(protect,protectRoutes("admin"),deleteQuestion);

export default router;