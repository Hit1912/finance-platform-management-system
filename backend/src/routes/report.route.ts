import { Router } from "express";
import {
  deleteReportController,
  generateReportController,
  getAllReportsController,
  resendReportController,
  updateReportSettingController,
} from "../controllers/report.controller";

const reportRoutes = Router();

reportRoutes.get("/all", getAllReportsController);
reportRoutes.get("/generate", generateReportController);
reportRoutes.put("/update-setting", updateReportSettingController);
reportRoutes.post("/resend/:id", resendReportController);
reportRoutes.delete("/delete/:id", deleteReportController);

export default reportRoutes;
