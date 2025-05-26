import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CustomSession } from '@/types/next-auth';
import Test from '@/models/test.model';
import User from '@/models/user.model';

export async function DELETE(req: NextRequest) {
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

    // Get user to verify ownership of tests
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all tests associated with the user
    const result = await Test.deleteMany({ user: userId });

    // Update user's tests array
    await User.findByIdAndUpdate(userId, { $set: { tests: [] } });

    console.log(`Deleted ${result.deletedCount} tests for user ${userId}`);

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} tests`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting tests:', error);
    return NextResponse.json(
      { error: 'Failed to delete tests' },
      { status: 500 }
    );
  }
} 