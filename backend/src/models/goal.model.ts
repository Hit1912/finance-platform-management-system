import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  icon?: string;
  userId: mongoose.Types.ObjectId;
}

const goalSchema = new Schema<IGoal>(
  {
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date },
    icon: { type: String, default: "Trophy" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const GoalModel = mongoose.model<IGoal>("Goal", goalSchema);
export default GoalModel;
