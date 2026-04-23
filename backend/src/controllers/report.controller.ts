import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import {
  deleteReportService,
  generateAndSendReportService,
  generateReportService,
  getAllReportsService,
  resendReportService,
  updateReportSettingService,
} from "../services/report.service";
import { updateReportSettingSchema } from "../validators/report.validator";

export const getAllReportsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const keyword = req.query.keyword as string;

    const result = await getAllReportsService(userId, pagination, keyword);

    return res.status(HTTPSTATUS.OK).json({
      message: "Reports history fetched successfully",
      ...result,
    });
  }
);

export const updateReportSettingController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = updateReportSettingSchema.parse(req.body);

    await updateReportSettingService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Reports setting updated successfully",
    });
  }
);

export const generateReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Date range (from, to) is required",
      });
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    const result = await generateAndSendReportService(userId, fromDate, toDate);

    if (!result.success) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: result.message,
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      message: result.message,
    });
  }
);

export const resendReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const id = req.params.id as string;

    await resendReportService(userId, id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Report resent successfully",
    });
  }
);

export const deleteReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const id = req.params.id as string;

    await deleteReportService(userId, id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Report deleted successfully",
    });
  }
);
