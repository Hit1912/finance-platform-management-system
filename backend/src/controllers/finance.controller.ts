import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getFinanceOverviewService,
  createCategoryService,
  createBudgetService,
  createGoalService,
  createBillService
} from "../services/finance.service";

export const getFinanceOverviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const result = await getFinanceOverviewService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Finance overview fetched successfully",
      data: result,
    });
  }
);

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const result = await createCategoryService(userId, req.body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Category created successfully",
      data: result,
    });
  }
);

export const createBudgetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const result = await createBudgetService(userId, req.body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Budget created successfully",
      data: result,
    });
  }
);

export const createGoalController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const result = await createGoalService(userId, req.body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Goal created successfully",
      data: result,
    });
  }
);

export const createBillController = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;
      const result = await createBillService(userId, req.body);
      return res.status(HTTPSTATUS.CREATED).json({
        message: "Bill created successfully",
        data: result,
      });
    }
  );
