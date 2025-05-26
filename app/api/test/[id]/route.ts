import { NextRequest, NextResponse } from 'next/server';
import Test from '@/models/test.model';
import { connectDb } from '@/config/db.config';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { CustomSession } from '../../../(user)/mentor/chat/route';
import User from '@/models/user.model';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions as any) as CustomSession;
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;

    // Validate the test ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid test ID format' }, { status: 400 });
    }

    // Convert string ID to ObjectId
    const testObjectId = new mongoose.Types.ObjectId(id);

    // First verify the user has access to this test
    const user = await User.findById(userId).populate({
      path: 'tests',
      select: '_id testName questions',
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Convert both IDs to strings for comparison
    const userTestIds = user.tests?.map((t: any) => t._id.toString()) || [];

    // Check if test exists in Test collection first
    const testExists = await Test.exists({ _id: testObjectId });

    if (!testExists) {
      // If test doesn't exist in Test collection, we should clean up the user's tests array
      if (userTestIds.includes(id)) {
        await User.findByIdAndUpdate(userId, {
          $pull: { tests: testObjectId }
        });
      }
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }

    if (!userTestIds.includes(id)) {
      return NextResponse.json({ message: 'Test not found or access denied' }, { status: 404 });
    }

    // Now fetch the test using ObjectId with proper population
    const populatedTest = await Test.findById(testObjectId)
      .populate({
        path: 'questions',
        select: 'question options correctAnswer',
        model: 'Question'
      })
      .lean();
    
    if (!populatedTest) {
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }
    
    if (!populatedTest.questions || populatedTest.questions.length === 0) {
      return NextResponse.json({ message: 'No questions found for this test' }, { status: 404 });
    }

    // Validate question data
    const validQuestions = populatedTest.questions.every((q: any) => 
      q && 
      typeof q === 'object' &&
      q.question && 
      Array.isArray(q.options) && 
      q.options.length > 0 && 
      q.correctAnswer
    );

    if (!validQuestions) {
      console.error('Invalid question data found:', populatedTest.questions[0]);
      return NextResponse.json({ message: 'Invalid question data found' }, { status: 500 });
    }

    // Transform the test data to include required fields
    const transformedTest = {
      ...populatedTest,
      questions: populatedTest.questions.map((q: any, idx: number) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        skillLevel: 'intermediate',
        technology: populatedTest.testName.split(' - ')[1] || 'general',
        explanation: `This question tests your understanding of ${populatedTest.testName.split(' - ')[1] || 'the topic'}.`,
        points: 10,
      }))
    };

    return NextResponse.json({ test: transformedTest }, { status: 200 });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json({ message: 'Error fetching test' }, { status: 500 });
  }
} 