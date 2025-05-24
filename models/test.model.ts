// models/Test.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITest extends Document {
  testName: string;
  questions: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TestSchema = new Schema<ITest>(
  {
    testName: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true }
);

const Test = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);
export default Test;
