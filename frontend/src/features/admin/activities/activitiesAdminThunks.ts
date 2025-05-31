import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../../axiosApi.ts";
import { isAxiosError } from "axios";
import type { GlobalError, IActivity, ValidationError } from "../../../types";

export const fetchAdminActivities = createAsyncThunk<
  IActivity[],
  void,
  { rejectValue: GlobalError | ValidationError }
>("adminActivities/fetchAdminActivities", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<IActivity[]>("/admin/activities", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const deleteAdminActivity = createAsyncThunk<
  { message: string; id: string },
  string,
  { rejectValue: GlobalError | ValidationError }
>("adminActivities/deleteAdminActivity", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosApi.delete<{ message: string }>(
      `/admin/activities/${id}`,
      { withCredentials: true },
    );
    return { message: response.data.message, id };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const togglePublishedAdminActivity = createAsyncThunk<
  IActivity,
  string,
  { rejectValue: GlobalError | ValidationError }
>(
  "adminActivities/togglePublishedAdminActivity",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosApi.patch<IActivity>(
        `/admin/activities/${id}/togglePublished`,
        {},
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);
