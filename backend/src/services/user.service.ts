import mongoose from "mongoose";
import UserModel from "../models/user.model";
import TransactionModel from "../models/transaction.model";
import ReportModel from "../models/report.model";
import ReportSettingModel from "../models/report-setting.model";
import { NotFoundException } from "../utils/app-error";
import { UpdateUserType } from "../validators/user.validator";

export const findByIdUserService = async (userId: string) => {
  // MOCK MODE: If DB is not connected, return a fake user object
  if (mongoose.connection.readyState !== 1) {
    return {
      _id: userId,
      name: "Mock User",
      email: "mock@example.com",
      profilePicture: "https://github.com/shadcn.png",
      omitPassword: () => ({
        _id: userId,
        name: "Mock User",
        email: "mock@example.com",
        profilePicture: "https://github.com/shadcn.png",
      }),
    } as any;
  }

  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserService = async (
  userId: string,
  body: UpdateUserType,
  profilePic?: Express.Multer.File
) => {
  // MOCK MODE: If DB is not connected, return a fake updated user
  if (mongoose.connection.readyState !== 1) {
    console.log("MOCK MODE: Simulating user update (No DB connected)");
    return {
      _id: userId,
      name: body.name || "Mock User",
      email: "mock@example.com",
      profilePicture: "https://github.com/shadcn.png",
    } as any;
  }

  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  // Extract the Cloudinary URL — multer-storage-cloudinary puts the URL in .path
  // which is an alias for the secure_url. We add a cast to access it safely.
  if (profilePic) {
    const cloudinaryFile = profilePic as Express.Multer.File & {
      secure_url?: string;
      url?: string;
    };

    let imageUrl =
      cloudinaryFile.secure_url ||
      cloudinaryFile.url;

    if (!imageUrl && cloudinaryFile.path) {
      if (cloudinaryFile.path.startsWith("http")) {
        imageUrl = cloudinaryFile.path;
      } else {
        // Local path fallback: construct URL
        // We assume public folder is served, so we strip 'public' from the path
        const relativePath = cloudinaryFile.path.replace(/\\/g, "/").split("public/")[1];
        // For simplicity in dev, we use localhost:5000. 
        // In a real app, this should come from config or req object.
        imageUrl = `http://localhost:5000/${relativePath}`;
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to extract image URL from uploaded file");
    }

    user.profilePicture = imageUrl;
  }

  if (body.name) {
    user.name = body.name;
  }

  await user.save();

  return user.omitPassword();
};

export const deleteAccountService = async (userId: any) => {
  // MOCK MODE: If DB is not connected, simulate success
  if (mongoose.connection.readyState !== 1) {
    console.log("MOCK MODE: Simulating account deletion (No DB connected)");
    return true;
  }

  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  // Ensure we have a valid ObjectId for queries
  const userObjectId = new mongoose.Types.ObjectId(userId.toString());

  // Delete all associated data
  await Promise.all([
    TransactionModel.deleteMany({ userId: userObjectId }),
    ReportModel.deleteMany({ userId: userObjectId }),
    ReportSettingModel.deleteMany({ userId: userObjectId }),
    UserModel.findByIdAndDelete(userObjectId),
  ]);

  return true;
};
