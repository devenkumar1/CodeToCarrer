import mongoose from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // changed from string[] to string
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: [
    {
    type: String,
    required: true,
  }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Question =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
