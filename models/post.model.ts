import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  description: string;
  user: mongoose.Types.ObjectId;
  likes: number;
  views: number;
  answers: mongoose.Types.ObjectId[];
  tags: string[];
  status: 'open' | 'closed' | 'resolved';
  votes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'resolved'],
    default: 'open'
  },
  votes: [{
    type: Schema.Types.ObjectId,
    ref: 'Vote'
  }]
}, {
  timestamps: true
});

// Create indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ likes: -1 });
postSchema.index({ tags: 1 });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;

