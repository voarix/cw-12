import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import { isAxiosError } from "axios";
import type { IGroup, GlobalError, ValidationError } from "../../types";

export const fetchGroupByActivityId = createAsyncThunk<
  IGroup,
  string,
  { rejectValue: ValidationError | GlobalError }
>("groups/fetchGroupByActivityId", async (activityId, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get(`/groups/by-activity/${activityId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const fetchMyParticipatedGroups = createAsyncThunk<
  IGroup[],
  void,
  { rejectValue: ValidationError }
>("groups/fetchMyParticipatedGroups", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.get("/groups/my-participate");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const removeParticipant = createAsyncThunk<
  void,
  { groupId: string; userId: string },
  { rejectValue: GlobalError }
>(
  "groups/removeParticipant",
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/groups/${groupId}/remove-participant/${userId}`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const addParticipant = createAsyncThunk<
  void,
  { groupId: string; userId: string },
  { rejectValue: GlobalError }
>("groups/addParticipant", async ({ groupId, userId }, { rejectWithValue }) => {
  try {
    await axiosApi.post(`/groups/${groupId}/add-participant/${userId}`);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
