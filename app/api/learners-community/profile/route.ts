import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/config/db.config';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { CustomSession } from '@/types/next-auth';
import User from '@/models/user.model';
import Post from '@/models/post.model';
import Answer from '@/models/answer.model';

// Get user profile
export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions) as CustomSession;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's posts with populated data
    const [userPosts, totalQuestions] = await Promise.all([
      Post.find({ user: userId })
        .select('_id title description likes views answers createdAt tags status')
        .sort({ createdAt: -1 })
        .lean(),
      Post.countDocuments({ user: userId })
    ]);

    // Get user data
    const user = await User.findById(userId)
      .select('name email createdAt')
      .lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get total likes from questions and answers
    const [questionsLikes, answersLikes] = await Promise.all([
      Post.aggregate([
        { $match: { user: user._id } },
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]),
      Answer.aggregate([
        { $match: { user: user._id } },
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ])
    ]);

    const totalLikes = (questionsLikes[0]?.total || 0) + (answersLikes[0]?.total || 0);

    // Transform the profile data
    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      questionsAsked: totalQuestions,
      answersGiven: 0, // TODO: Implement answers count
      totalLikes,
      recentQuestions: userPosts.map(post => ({
        _id: post._id,
        title: post.title,
        description: post.description,
        likes: post.likes || 0,
        views: post.views || 0,
        answers: post.answers?.length || 0,
        createdAt: post.createdAt,
        tags: post.tags || [],
        status: post.status || 'open'
      }))
    };

    return NextResponse.json({
      message: 'Profile data fetched successfully',
      ...profile
    });

  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions) as CustomSession;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { message: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true }
    ).select('name email');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 