import mongoose from "mongoose";

const rewardSchema = mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  cost: { type: Number, required: true },
  id: { type: String },
});

export default mongoose.model("Reward", rewardSchema);