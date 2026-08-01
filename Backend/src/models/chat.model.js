// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "New Chat",
            trim: true,
        },
        isArchived: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const chatModel = mongoose.model('chat',chatSchema);

export default chatModel;