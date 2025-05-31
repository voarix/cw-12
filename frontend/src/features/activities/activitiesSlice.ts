import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { GlobalError, IActivity, ValidationError } from "../../types";
import {
  createActivity,
  fetchActivitiesByAuthor,
  fetchAllActivities,
  fetchMyActivities,
} from "./activititesThunks.ts";

interface ActivitiesState {
  items: IActivity[];
  fetchLoading: boolean;
  error: ValidationError | null | GlobalError;

  oneItem: IActivity | null;
  fetchOneLoading: boolean;
  fetchOneError: GlobalError | null | ValidationError;

  createLoading: boolean;
  createError: GlobalError | null | ValidationError;
}

const initialState: ActivitiesState = {
  items: [],
  fetchLoading: false,
  error: null,

  oneItem: null,
  fetchOneLoading: false,
  fetchOneError: null,

  createLoading: false,
  createError: null,
};

export const selectActivities = (state: RootState) => state.activities.items;
export const selectFetchLoading = (state: RootState) =>
  state.activities.fetchLoading;
export const selectFetchError = (state: RootState) => state.activities.error;

export const selectFetchOneLoading = (state: RootState) =>
  state.activities.fetchOneLoading;
export const selectOneActivity = (state: RootState) => state.activities.oneItem;
export const selectFetchOneError = (state: RootState) =>
  state.activities.fetchOneError;

export const selectCreateLoading = (state: RootState) =>
  state.activities.createLoading;
export const selectCreateError = (state: RootState) =>
  state.activities.createError;

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllActivities.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchAllActivities.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.items = payload;
      })
      .addCase(fetchAllActivities.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.error = payload || null;
      })

      .addCase(fetchActivitiesByAuthor.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesByAuthor.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.items = payload;
      })
      .addCase(fetchActivitiesByAuthor.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.error = payload || null;
      })

      .addCase(fetchMyActivities.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchMyActivities.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.items = payload;
      })
      .addCase(fetchMyActivities.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.error = payload || null;
      })

      .addCase(createActivity.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createActivity.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createActivity.rejected, (state, { payload }) => {
        state.createLoading = false;
        state.createError = payload || null;
      });
  },
});

export const activitiesReducer = activitiesSlice.reducer;
