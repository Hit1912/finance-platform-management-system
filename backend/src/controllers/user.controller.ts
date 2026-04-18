import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import {
  deleteAccountService,
  findByIdUserService,
  updateUserService,
} from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";
import { updateUserSchema } from "../validators/user.validator";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await findByIdUserService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "User fetched successfully",
      user,
    });
  }
);

export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user?._id;
    const profilePic = req.file;

    const user = await updateUserService(userId, parsed.data, profilePic);

    return res.status(HTTPSTATUS.OK).json({
      message: "User profile updated successfully",
      data: user,
    });
  }
);

export const deleteAccountController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized: User ID not found",
      });
    }

    await deleteAccountService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Account and all associated data deleted successfully",
    });
  }
);
