import { Router } from "express";
import {
  getFinanceOverviewController,
  createCategoryController,
  createBudgetController,
  createGoalController,
  createBillController
} from "../controllers/finance.controller";

const financeRoutes = Router();

financeRoutes.get("/overview", getFinanceOverviewController);
financeRoutes.post("/category", createCategoryController);
financeRoutes.post("/budget", createBudgetController);
financeRoutes.post("/goal", createGoalController);
financeRoutes.post("/bill", createBillController);

export default financeRoutes;
