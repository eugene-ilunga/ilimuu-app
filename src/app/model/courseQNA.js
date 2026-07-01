import { Schema, model, models } from "mongoose";

const AnswerSchema = new Schema({
  content: { type: String, required: true },
  answeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answeredAt: { type: Date, default: Date.now },
});

const QuestionSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "course", required: true },
  question: { type: String, required: true },
  askedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  askedAt: { type: Date, default: Date.now },
  answers: [AnswerSchema],
});

export default models.Question || model("Question", QuestionSchema);
