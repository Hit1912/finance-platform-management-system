import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middlerware";
import connctDatabase from "./config/database.config";
import authRoutes from "./routes/auth.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import { initializeCrons } from "./cron";
import reportRoutes from "./routes/report.route";
import { getDateRange } from "./utils/date";
import analyticsRoutes from "./routes/analytics.route";
import financeRoutes from "./routes/finance.route";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Welcome to Personal Finance Platform API",
    });
  })
);

import { checkDbConnection } from "./middlewares/dbCheck.middleware";

app.use(`${BASE_PATH}/auth`, checkDbConnection, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, checkDbConnection, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, checkDbConnection, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, checkDbConnection, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, checkDbConnection, analyticsRoutes);
app.use(`${BASE_PATH}/finance`, passportAuthenticateJwt, checkDbConnection, financeRoutes);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connctDatabase();

  if (Env.NODE_ENV === "development") {
    await initializeCrons();
  }

  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
