import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { mockBaseQuery } from "./mock-base-query";

// Mock base query for Database-Free Local Development
const baseQuery = mockBaseQuery;

export const apiClient = createApi({
  reducerPath: "api", // Add API client reducer to root reducer
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true, // Refetch on mount or arg change
  tagTypes: ["transactions", "analytics", "billingSubscription", "Reports", "finance"], // Tag types for RTK Query
  endpoints: () => ({}), // Endpoints for RTK Query
});
