import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateTopicTestsPrompt } from "./geminTestPrompt";

 export async function generateTest(topicName: string) {
  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = await generateTopicTestsPrompt(topicName);
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanedResponseText = responseText
      .replace(/```json\n|\n```/g, "")
      .trim();
     console.log("raw response from the gemini ",responseText);
    try {
      const parsedresult = await JSON.parse(cleanedResponseText);
      console.log("after generating the tests from gemini");
    console.log(parsedresult);
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log("couldn't get  response from the gemini ");
  }
}

export default generateTest;