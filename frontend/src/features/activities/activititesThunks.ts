import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";
import type {
  ActivityMutation,
  GlobalError,
  IActivity,
  ValidationError,
} from "../../types";

export const fetchAllActivities = createAsyncThunk<
  IActivity[],
  void,
  { rejectValue: ValidationError }
>("activities/fetchAllActivities", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<IActivity[]>("/activities");
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const fetchActivitiesByAuthor = createAsyncThunk<
  IActivity[],
  string,
  { rejectValue: ValidationError | GlobalError }
>(
  "activities/fetchActivitiesByAuthor",
  async (authorId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<IActivity[]>(
        `/activities/author/${authorId}`,
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

export const fetchMyActivities = createAsyncThunk<
  IActivity[],
  void,
  { rejectValue: ValidationError }
>("activities/fetchMyActivities", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<IActivity[]>("/activities/my");
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const createActivity = createAsyncThunk<
  IActivity,
  ActivityMutation,
  { rejectValue: ValidationError | GlobalError }
>("activities/createActivity", async (activityToAdd, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("title", activityToAdd.title);
    formData.append("description", activityToAdd.description);
    if (activityToAdd.image) {
      formData.append("image", activityToAdd.image);
    }

    const response = await axiosApi.post<IActivity>("/activities", formData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const deleteActivity = createAsyncThunk<
  void,
  string,
  { rejectValue: GlobalError }
>("activities/deleteActivity", async (activityId, { rejectWithValue }) => {
  try {
    await axiosApi.delete(`/activities/${activityId}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
