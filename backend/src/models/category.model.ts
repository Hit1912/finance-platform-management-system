import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon?: string;
  color?: string;
  userId: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    icon: { type: String },
    color: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate names for the same user
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);
export default CategoryModel;
