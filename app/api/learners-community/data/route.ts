import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/config/db.config';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { CustomSession } from '@/types/next-auth';
import Post from '@/models/post.model';
import User from '@/models/user.model';

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions) as CustomSession;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get total questions and users count
    const [totalQuestions, totalUsers] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments()
    ]);

    return NextResponse.json({
      message: 'Community data fetched successfully',
      data: {
        stats: {
          totalQuestions,
          totalUsers
        }
      }
    });

  } catch (error) {
    console.error('Error fetching community data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch community data' },
      { status: 500 }
    );
  }
} 