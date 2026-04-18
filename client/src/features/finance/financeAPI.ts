import { apiClient } from "@/app/api-client";
import { FinanceOverviewResponse } from "./financeType";

export const financeApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceOverview: builder.query<FinanceOverviewResponse, void>({
      query: () => ({
        url: "/finance/overview",
        method: "GET",
      }),
      providesTags: ["finance"],
    }),
    createCategory: builder.mutation<void, any>({
      query: (data) => ({
        url: "/finance/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["finance"],
    }),
    createBudget: builder.mutation<void, any>({
      query: (data) => ({
        url: "/finance/budget",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["finance"],
    }),
    createGoal: builder.mutation<void, any>({
      query: (data) => ({
        url: "/finance/goal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["finance"],
    }),
    createBill: builder.mutation<void, any>({
      query: (data) => ({
        url: "/finance/bill",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["finance"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFinanceOverviewQuery,
  useCreateCategoryMutation,
  useCreateBudgetMutation,
  useCreateGoalMutation,
  useCreateBillMutation,
} = financeApi;
