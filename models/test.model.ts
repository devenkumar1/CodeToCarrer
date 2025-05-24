import mongoose from "mongoose";

export interface ITest {
  testName: string;
  part: number;
  questions: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TestSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  part: {
    type: Number,
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
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

const Test =
  mongoose.models.Test || mongoose.model<ITest>("Test", TestSchema);
export default Test;
