import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages);

  return response.content;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for chat conversations.

The user will provide the first message of a conversation.
Generate a short title in 3-5 words that clearly captures the topic of the chat.
`),

    new HumanMessage(`
Generate a title for this chat:

"${message}"
`),
  ]);

  return response.content;
}