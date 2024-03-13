import express from "express";
import trimRequest from "trim-request";
import { protect } from "../middleware/auth.middleware.js";
import { CreateOpenConversation, getConversations } from "../controller/conversation.controller.js";
const router = express.Router();

router.route("/").post(trimRequest.all,protect,CreateOpenConversation);
router.route("/").get(trimRequest.all,protect,getConversations);
export default router;