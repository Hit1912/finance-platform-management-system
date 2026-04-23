import mongoose from "mongoose";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import { calulateNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (body: RegisterSchemaType) => {
  // MOCK MODE: Fallback if DB is not connected
  if (mongoose.connection.readyState !== 1) {
    console.log("MOCK MODE: Simulating registration (No DB connected)");
    return {
      user: {
        _id: "mock_user_id",
        name: body.name,
        email: body.email,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  const { email } = body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new UnauthorizedException("User already exists");

  const newUser = new UserModel({
    ...body,
  });

  await newUser.save();

  const reportSetting = new ReportSettingModel({
    userId: newUser._id,
    frequency: ReportFrequencyEnum.MONTHLY,
    isEnabled: true,
    nextReportDate: calulateNextReportDate(),
    lastSentDate: null,
  });
  await reportSetting.save();

  return { user: newUser.omitPassword() };
};

export const loginService = async (body: LoginSchemaType) => {
  // MOCK MODE: Fallback if DB is not connected
  if (mongoose.connection.readyState !== 1) {
    console.log("MOCK MODE: Simulating login (No DB connected)");
    const { token, expiresAt } = signJwtToken({ userId: "mock_user_id" });
    
    // Extract name from email (e.g., hit.dungrani@gmail.com -> Hit Dungrani)
    const nameFromEmail = body.email
      .split("@")[0]
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return {
      user: {
        _id: "mock_user_id",
        name: nameFromEmail || "User",
        email: body.email,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: token,
      expiresAt,
      reportSetting: {
        _id: "mock_setting_id",
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true
      }
    };
  }

  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("Email/password not found");

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid)
    throw new UnauthorizedException("Invalid email/password");

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  const reportSetting = await ReportSettingModel.findOne(
    {
      userId: user.id,
    },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
    reportSetting,
  };
};
