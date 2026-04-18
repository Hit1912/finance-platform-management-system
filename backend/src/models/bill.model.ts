import mongoose, { Document, Schema } from "mongoose";

export enum BillStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export interface IBill extends Document {
  provider: string;
  type: string;
  amount: number;
  dueDate: Date;
  status: BillStatus;
  userId: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
}

const billSchema = new Schema<IBill>(
  {
    provider: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(BillStatus), default: BillStatus.PENDING },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

const BillModel = mongoose.model<IBill>("Bill", billSchema);
export default BillModel;
