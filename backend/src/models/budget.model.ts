import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  amount: number;
  period: string; // e.g., 'MONTHLY'
  categoryId?: mongoose.Types.ObjectId; // Optional: Link to a specific category
  userId: mongoose.Types.ObjectId;
}

const budgetSchema = new Schema<IBudget>(
  {
    amount: { type: Number, required: true },
    period: { type: String, default: "MONTHLY" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// One budget per category per user (or one global budget if categoryId is null)
budgetSchema.index({ categoryId: 1, userId: 1 }, { unique: true });

const BudgetModel = mongoose.model<IBudget>("Budget", budgetSchema);
export default BudgetModel;
