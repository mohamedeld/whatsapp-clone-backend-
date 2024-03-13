import express from "express";
import authRoutes from "./auth.route.js";
import conversationRoutes from "./conversation.route.js";
import messageRoutes from "./message.route.js";
import questionRoutes from "./question.route.js";
const router= express.Router();

router.use("/auth",authRoutes);
router.use("/conversation",conversationRoutes);
router.use("/message",messageRoutes);
router.use("/question",questionRoutes);
export default router;