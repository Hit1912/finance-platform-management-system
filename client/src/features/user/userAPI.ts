import { apiClient } from "@/app/api-client";
import { UpdateUserResponse } from "./userType";

export const userApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, FormData>({
      query: (formData) => ({
        url: "/user/update",
        method: "PUT",
        body: formData,
        formData: true, // tells RTK Query to NOT set Content-Type:json — lets browser set multipart/form-data with correct boundary
      }),
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/user/delete",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useUpdateUserMutation, useDeleteAccountMutation } = userApi;
