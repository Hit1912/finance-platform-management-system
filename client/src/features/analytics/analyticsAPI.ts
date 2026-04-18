import { apiClient } from "@/app/api-client";
import { ChartAnalyticsResponse, ExpensePieChartBreakdownResponse, FilterParams, SummaryAnalyticsResponse } from "./anayticsType";

export const analyticsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    summaryAnalytics: builder.query<SummaryAnalyticsResponse, FilterParams>({
      query: ({preset, from, to, keyword}) => ({
        url: "/analytics/summary",
        method: "GET",
        params: {preset, from, to, keyword}
      }),
      providesTags: ["analytics"],
    }),
    chartAnalytics: builder.query<ChartAnalyticsResponse, FilterParams>({
      query: ({preset, from, to, keyword}) => ({
        url: "/analytics/chart",
        method: "GET",
        params: {preset, from, to, keyword}
      }),
      providesTags: ["analytics"],
    }),
    expensePieChartBreakdown: builder.query<ExpensePieChartBreakdownResponse, FilterParams  >({
      query: ({preset, from, to, keyword}) => ({
        url: "/analytics/expense-breakdown",
        method: "GET",
        params: {preset, from, to, keyword}
      }),
      providesTags: ["analytics"],
    }),
  }),
});

export const {
  useSummaryAnalyticsQuery,
  useChartAnalyticsQuery,
  useExpensePieChartBreakdownQuery,
} = analyticsApi;
