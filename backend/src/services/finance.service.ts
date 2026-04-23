import mongoose from "mongoose";
import CategoryModel from "../models/category.model";
import BudgetModel from "../models/budget.model";
import GoalModel from "../models/goal.model";
import BillModel from "../models/bill.model";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model";
import { startOfMonth, endOfMonth } from "date-fns";

export const getFinanceOverviewService = async (userId: string) => {
  // MOCK MODE: Fallback if DB is not connected
  if (mongoose.connection.readyState !== 1) {
    console.log("MOCK MODE: Simulating finance overview (No DB connected)");
    return {
      categories: [
        { name: "Housing", total: 1200, count: 1 },
        { name: "Food", total: 500, count: 10 },
        { name: "Transport", total: 300, count: 5 },
      ],
      budgets: [
        { _id: "b1", category: "Food", amount: 600, spent: 500 },
        { _id: "b2", category: "Transport", amount: 400, spent: 300 },
      ],
      goals: [
        { _id: "g1", title: "Tesla Model S Plaid", targetAmount: 130000, currentAmount: 45000 },
      ],
      bills: [
        { _id: "bl1", title: "Electricity", amount: 150, dueDate: new Date() },
      ]
    };
  }
  const [categories, budgets, goals, bills] = await Promise.all([
    CategoryModel.find({ userId }),
    BudgetModel.find({ userId }),
    GoalModel.find({ userId }),
    BillModel.find({ userId }).sort({ dueDate: 1 }),
  ]);

  // If no data exists, this service will return empty arrays.
  // We can also aggregate transaction data to provide 'Live' category insights even if CategoryModel is empty.
  
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const categoryAgg = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: start, $lte: end },
        type: TransactionTypeEnum.EXPENSE
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: { $abs: "$amount" } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 1,
        total: { $divide: ["$total", 100] },
        count: 1
      }
    }
  ]);

  return {
    categories: categoryAgg.map(c => ({
      name: c._id,
      total: Math.round(c.total * 100) / 100, // Ensure 2 decimal places
      count: c.count
    })),
    budgets,
    goals,
    bills
  };
};

export const createCategoryService = async (userId: string, data: any) => {
  return await CategoryModel.create({ ...data, userId });
};

export const createBudgetService = async (userId: string, data: any) => {
  return await BudgetModel.create({ ...data, userId });
};

export const createGoalService = async (userId: string, data: any) => {
  return await GoalModel.create({ ...data, userId });
};

export const createBillService = async (userId: string, data: any) => {
    return await BillModel.create({ ...data, userId });
};
