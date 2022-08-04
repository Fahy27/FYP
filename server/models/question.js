import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question: { type: String, required:  true },
  answers: { type: [String] },
  correctAnswer: {type: Number},
  id: { type: String }
});

export default mongoose.model("Question", questionSchema);