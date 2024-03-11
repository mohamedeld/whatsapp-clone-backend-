import express from "express";
import trimRequest from "trim-request";
import { login,register,logout,refreshToken } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router= express.Router();

router.route("/register").post(trimRequest.all,register);
router.route("/login").post(trimRequest.all,login);
router.route("/logout").post(trimRequest.all,logout);
router.route("/refreshtoken").post(trimRequest.all,refreshToken);
router.route("/welcome").get(trimRequest.all,protect,(req,res)=>{
  res.json({
    message:"welcome"
  })
});
export default router;