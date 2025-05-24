import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateTopicTestsPrompt } from "./geminTestPrompt";
import Test from "@/models/test.model";
import Question, { IQuestion } from "@/models/question.model";
import User from "@/models/user.model";
import mongoose from "mongoose";
export async function generateTest(topicName: string, userId?: string) {
  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = await generateTopicTestsPrompt(topicName);
  console.log(`Generating test for topic: ${topicName}, user: ${userId}`);
try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanedResponseText = responseText.replace(/```json\n?|\n```/g, "").trim();

    console.log("✅ Raw Gemini response:", responseText);

    const parsedResult = JSON.parse(cleanedResponseText);
    const tests = parsedResult.tests;

    if (!Array.isArray(tests)) {
      console.error("❌ Parsed result is not an array of tests.");
      return;
    }

    for (const test of tests) {
      const questionDocs = await Question.insertMany(test.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })));

      const newTest = await Test.create({
        testName: test.testName,
        questions: questionDocs.map(q => q._id),
      });

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $push: { tests: newTest._id },
        });
      }

      console.log(`✅ Saved test: ${newTest.testName}`);
    }

    console.log("✅ All tests saved once.");
  } catch (err) {
    console.error("❌ Error during test generation or saving:", err);
  }
}

export default generateTest;