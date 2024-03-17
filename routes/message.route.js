import express from 'express';
import trimRequest from 'trim-request';
import { protect } from "../middleware/auth.middleware.js";
import { sendMessage,getMessage } from '../controller/message.controller.js';
const router = express.Router();

router.route("/").post(trimRequest.all,protect,sendMessage);
router.route("/:convId").get(trimRequest.all,protect,getMessage);

export default router;