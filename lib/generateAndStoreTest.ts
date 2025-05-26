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
      throw new Error("Invalid test format received from AI");
    }

    console.log(`✅ Parsed ${tests.length} tests from AI response`);

    for (const test of tests) {
      console.log(`Creating test: ${test.testName}`);
      console.log(`Number of questions in test: ${test.questions.length}`);

      const questionDocs = await Question.insertMany(test.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })));

      console.log(`✅ Created ${questionDocs.length} questions`);

      const newTest = await Test.create({
        testName: test.testName,
        questions: questionDocs.map(q => q._id),
      });

      console.log(`✅ Created test document with ID: ${newTest._id}`);

      if (userId) {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          $push: { tests: newTest._id },
        }, { new: true });
        console.log(`✅ Added test to user ${userId}, total tests: ${updatedUser?.tests?.length || 0}`);
      }

      console.log(`✅ Saved test: ${newTest.testName}`);
    }

    console.log("✅ All tests saved successfully");
  } catch (err) {
    console.error("❌ Error during test generation or saving:", err);
    throw err; // Re-throw to handle in the API route
  }
}

export default generateTest;