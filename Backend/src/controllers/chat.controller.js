import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId, images } = req.body;

        let title = null,
            chat = null;

        // Create new chat if chatId not exists
        if (!chatId) {
            title = await generateChatTitle(message || "Image Query");

            chat = await chatModel.create({
                user: req.user.id,
                title
            });
        } else {
            chat = await chatModel.findById(chatId);
        }

        // Save user message
        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message || "",
            role: "user",
            images: images || [],
        });

        // Get all messages from DB
        const messages = await messageModel.find({
            chat: chatId || chat._id
        });

        // Convert DB messages to LangChain messages
        const formattedMessages = messages.map((msg) => {
            if (msg.role === "user") {
                if (msg.images && msg.images.length > 0) {
                    const content = [
                        { type: "text", text: msg.content || "" }
                    ];
                    msg.images.forEach((img) => {
                        content.push({
                            type: "image_url",
                            image_url: { url: img },
                        });
                    });
                    return new HumanMessage({ content });
                }
                return new HumanMessage(msg.content);
            }

            return new AIMessage(msg.content);
        });

        // Generate AI response
        const result = await generateResponse(formattedMessages);

        console.log(result);

        // Save AI response
        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: result,
            role: "ai",
        });

        res.status(201).json({
            title,
            chat,
            userMessage,
            aiMessage
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}


export async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({
        user: user.id
    });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;
    const chat = await chatModel.findById({
        _id: chatId,
        user: req.user.id
    })
    if (!chat) {
        return res.status(404).json({
            message: "chat not found"
        })
    }
    const message = await messageModel.find({
        chat: chatId
    })
    res.status(200).json({
        message: "Message retrieved successfully",
        message
    })
}


export async function deleteChat(req, res) {
    const { chatId } = req.params;
    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId,
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }
    res.status(200).json({
        message: "chat deleted successfully"
    })
}

export async function archiveChat(req, res) {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.isArchived = !chat.isArchived;
        await chat.save();

        res.status(200).json({
            message: chat.isArchived ? "Chat archived" : "Chat unarchived",
            chat
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}