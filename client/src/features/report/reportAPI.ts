import { apiClient } from "@/app/api-client";
import { GetAllReportResponse, UpdateReportSettingParams } from "./reportType";

export const reportApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({

    getAllReports: builder.query<GetAllReportResponse, { pageNumber: number, pageSize: number, keyword?: string }>({
      query: (params) => {
        const { pageNumber = 1, pageSize = 20, keyword } = params;
        return ({
          url: "/report/all",
          method: "GET",
          params: { pageNumber, pageSize, keyword },
        });
      },
      providesTags: ["Reports"],
    }),

    updateReportSetting: builder.mutation<void, UpdateReportSettingParams>({
      query: (payload) => ({
        url: "/report/update-setting",
        method: "PUT",
        body: payload,
      }),
    }),
    resendReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/report/resend/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/report/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),
    generateReport: builder.mutation<void, { from: string; to: string }>({
      query: (params) => ({
        url: "/report/generate",
        method: "GET",
        params,
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useUpdateReportSettingMutation,
  useResendReportMutation,
  useDeleteReportMutation,
  useGenerateReportMutation,
} = reportApi;
