import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionSchema = new mongoose.Schema<IQuestion>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }, // fixed
  },
  { timestamps: true }
);

const Question =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
