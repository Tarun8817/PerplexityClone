import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi() {
  try {
    const response = await model.invoke(
      "What is the capital of India?"
    );

    console.log(response.content);

  } catch (error) {
    console.log("Error:", error.message);
  }
}