import { Router } from "express";
import { sendMessage, getChats, getMessages, deleteChat, archiveChat } from "../controllers/chat.controller.js";
import authUser from "../middlewares/auth.middleware.js"
import { get } from "mongoose";
const chatRouter = Router()

chatRouter.post("/message", authUser, sendMessage)
chatRouter.get("/", authUser, getChats)
chatRouter.get("/:chatId/messages", authUser, getMessages)
chatRouter.delete("/delete/:chatId/", authUser, deleteChat)
chatRouter.patch("/:chatId/archive", authUser, archiveChat)
export default chatRouter;
