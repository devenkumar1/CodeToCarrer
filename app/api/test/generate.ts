import { NextRequest, NextResponse } from "next/server";
import { CustomSession } from "../(user)/mentor/chat/route";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { connectDb } from "@/config/db.config";
import Test from "@/models/test.model";
import Question from "@/models/question.model";
import User from "@/models/user.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  console.log('Starting test generation endpoint...');
  await connectDb();
  
  const session = await getServerSession(authOptions as any) as CustomSession;
  if (!session || !session.user?.id) {
    console.log('Unauthorized request - no valid session');
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  console.log('User ID:', userId);

  try {
    const reqBody = await req.json();
    const { topicName } = reqBody;
    
    if (!topicName) {
      console.log('No topic name provided');
      return NextResponse.json({ message: "Topic name is required" }, { status: 400 });
    }

    console.log("Received topic name:", topicName);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined');
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Create a test with 10 multiple choice questions about ${topicName}.
    Each question should have 4 options and one correct answer.
    Return the response in this exact JSON format:
    {
      "testName": "Test - ${topicName}",
      "questions": [
        {
          "question": "What is...?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option B"
        }
      ]
    }
    `;

    console.log('Generating test with Gemini...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log('Raw response received');

    const cleanedResponseText = responseText.replace(/```json\n?|\n```/g, "").trim();
    let testData;
    
    try {
      testData = JSON.parse(cleanedResponseText);
      console.log('Successfully parsed test data');
    } catch (parseError) {
      console.error('Failed to parse test data:', parseError);
      return NextResponse.json({ message: "Failed to generate valid test data" }, { status: 500 });
    }

    if (!testData.questions || !Array.isArray(testData.questions) || testData.questions.length === 0) {
      console.error('Invalid test data structure:', testData);
      return NextResponse.json({ message: "Invalid test data structure" }, { status: 500 });
    }

    console.log(`Creating test with ${testData.questions.length} questions`);

    // Create questions first
    const questionDocs = await Question.insertMany(
      testData.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }))
    );

    console.log(`Created ${questionDocs.length} questions`);

    // Create test document
    const newTest = await Test.create({
      testName: testData.testName,
      questions: questionDocs.map(q => q._id),
    });

    console.log(`Created test document with ID: ${newTest._id}`);

    // Update user with new test
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { tests: newTest._id } },
      { new: true }
    );

    if (!updatedUser) {
      console.error(`Failed to update user ${userId}`);
      // Delete the test if we can't associate it with the user
      await Test.findByIdAndDelete(newTest._id);
      return NextResponse.json({ message: "Failed to associate test with user" }, { status: 500 });
    }

    console.log(`Successfully added test to user ${userId}`);

    return NextResponse.json({
      message: "Test generated successfully",
      testId: newTest._id,
      testName: newTest.testName,
      questionCount: questionDocs.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json({
      message: "Failed to generate test",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 