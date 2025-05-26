import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/config/db.config';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { CustomSession } from '@/types/next-auth';
import Chat from '@/models/chat.model';
import User from '@/models/user.model';

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions) as CustomSession;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user to verify ownership of chats
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all chats associated with the user
    const result = await Chat.deleteMany({ user: userId });

    // Update user's chats array
    await User.findByIdAndUpdate(userId, { $set: { chats: [] } });

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} chats`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting chats:', error);
    return NextResponse.json(
      { error: 'Failed to delete chats' },
      { status: 500 }
    );
  }
} 