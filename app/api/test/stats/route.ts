import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/config/db.config';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { CustomSession } from '../../../(user)/mentor/chat/route';
import User from '@/models/user.model';
import Test from '@/models/test.model';

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions as any) as CustomSession;
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all tests for the user
    const user = await User.findById(userId).populate({
      path: 'tests',
      select: 'testName marksScored totalMarks completedAt',
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const allTests = user.tests || [];
    const totalTests = allTests.length;
    const completedTests = allTests.filter((test: any) => test.isCompleted);
    const completedTestsCount = completedTests.length;

    // Calculate statistics
    const totalMarksScored = completedTests.reduce((sum: number, test: any) => sum + (test.marksScored || 0), 0);
    const totalPossibleMarks = completedTests.reduce((sum: number, test: any) => sum + (test.totalMarks || 0), 0);
    const averageScore = totalPossibleMarks > 0 ? (totalMarksScored / totalPossibleMarks) * 100 : 0;

    // Get recent completed tests (last 5)
    const recentTests = completedTests
      .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5)
      .map((test: any) => ({
        testName: test.testName,
        marksScored: test.marksScored,
        totalMarks: test.totalMarks,
        completedAt: test.completedAt,
      }));

    const stats = {
      totalTests,
      completedTests: completedTestsCount,
      averageScore,
      totalMarksScored,
      totalPossibleMarks,
      recentTests,
    };

    return NextResponse.json({
      message: 'Test statistics fetched successfully',
      stats
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching test statistics:', error);
    return NextResponse.json({
      message: 'Error fetching test statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 