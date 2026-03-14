import { NextRequest, NextResponse } from "next/server";
import { CustomSession } from "../(user)/mentor/chat/route";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import Test from '@/models/test.model';
import User from '@/models/user.model';
import { connectDb } from '@/config/db.config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Question from '@/models/question.model';

export async function POST(req: NextRequest) {
  await connectDb();
  
  const session = await getServerSession(authOptions as any) as CustomSession;
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const reqBody = await req.json();
    const { topicName } = reqBody;

    if (!topicName) {
      return NextResponse.json({ message: "Topic name is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined');
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const cleanedResponseText = responseText.replace(/```json\n?|\n```/g, "").trim();
    let testData;
    
    try {
      testData = JSON.parse(cleanedResponseText);
    } catch (parseError) {
      console.error('Failed to parse test data:', parseError);
      return NextResponse.json({ message: "Failed to generate valid test data" }, { status: 500 });
    }

    if (!testData.questions || !Array.isArray(testData.questions) || testData.questions.length === 0) {
      console.error('Invalid test data structure:', testData);
      return NextResponse.json({ message: "Invalid test data structure" }, { status: 500 });
    }

    const questionDocs = await Question.insertMany(
      testData.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }))
    );

    const newTest = await Test.create({
      testName: testData.testName,
      questions: questionDocs.map(q => q._id),
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { tests: newTest._id } },
      { new: true }
    );

    if (!updatedUser) {
      await Test.findByIdAndDelete(newTest._id);
      return NextResponse.json({ message: "Failed to associate test with user" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Test generated successfully",
      testId: newTest._id,
      testName: newTest.testName,
      questionCount: questionDocs.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error in test generation route:", error);
    return NextResponse.json({
      message: "Failed to generate test",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDb();
  
  const session = await getServerSession(authOptions as any) as CustomSession;
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await User.findById(userId).populate({
      path: 'tests',
      select: 'testName createdAt questions',
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.tests || user.tests.length === 0) {
      return NextResponse.json({ message: 'No tests found for this user', tests: [] }, { status: 200 });
    }

    const tests = user.tests.map((test: any) => ({
      _id: test._id,
      testName: test.testName,
      createdAt: test.createdAt,
      questionCount: test.questions?.length || 0,
    }));

    return NextResponse.json({ message: 'Tests fetched successfully', tests }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json({
      message: 'Error fetching tests',
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}