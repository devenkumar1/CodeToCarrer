// models/Test.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITest extends Document {
  testName: string;
  questions: mongoose.Types.ObjectId[];
  isCompleted: boolean;
  marksScored: number;
  totalMarks: number;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TestSchema = new Schema<ITest>(
  {
    testName: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    isCompleted: { type: Boolean, default: false },
    marksScored: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const Test = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);
export default Test;
