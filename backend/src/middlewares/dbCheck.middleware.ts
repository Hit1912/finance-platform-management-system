import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../config/http.config";

export const checkDbConnection = (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    throw new AppError(
      "Database not connected. Please ensure MongoDB is running.",
      HTTPSTATUS.SERVICE_UNAVAILABLE
    );
  }
  next();
};
