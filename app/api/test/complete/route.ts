import { NextRequest, NextResponse } from 'next/server';
import Test from '@/models/test.model';
import { connectDb } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CustomSession } from '@/types/next-auth';
import User from '@/models/user.model';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
   
    await connectDb();

    // Get user session
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session?.user?.id) {
 
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    

    // Validate request body
    const body = await req.json();
    const { testId, marksScored, totalMarks } = body;
    

    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json(
        { error: 'Invalid test ID' },
        { status: 400 }
      );
    }

    if (typeof marksScored !== 'number' || typeof totalMarks !== 'number') {
      return NextResponse.json(
        { error: 'Invalid marks data' },
        { status: 400 }
      );
    }

    // Check if user has access to this test
    const user = await User.findById(userId).populate('tests');
    if (!user) {
      console.log('Test completion API: User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }


    const hasAccess = user.tests.some((test: any) => test._id.toString() === testId);
    if (!hasAccess) {
     
      return NextResponse.json(
        { error: 'You do not have access to this test' },
        { status: 403 }
      );
    }

    // Update test completion status
    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }
    // Update test fields
    test.isCompleted = true;
    test.marksScored = marksScored;
    test.totalMarks = totalMarks;
    test.completedAt = new Date();
    
    // Save the updated test
    await test.save();
    
    // Populate questions for the response
    await test.populate('questions');


    return NextResponse.json({
      message: 'Test completed successfully',
      test
    });

  } catch (error) {
    console.error('Test completion API: Error completing test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 