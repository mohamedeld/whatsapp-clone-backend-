import express from "express";
import trimRequest from "trim-request";
import { searchUsers } from "../controller/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router= express.Router();

router.route("/").get(trimRequest.all,protect,searchUsers);

export default router;