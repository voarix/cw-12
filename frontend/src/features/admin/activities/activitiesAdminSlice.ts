import { createSlice } from "@reduxjs/toolkit";
import {
  deleteAdminActivity,
  fetchAdminActivities,
  togglePublishedAdminActivity,
} from "./activitiesAdminThunks.ts";
import type { GlobalError, IActivity, ValidationError } from "../../../types";
import type { RootState } from "../../../app/store.ts";

interface AdminActivitiesState {
  items: IActivity[];
  loading: boolean;
  error: ValidationError | null | GlobalError;
}

export const selectAdminActivities = (state: RootState) =>
  state.adminActivities.items;
export const selectAdminLoading = (state: RootState) =>
  state.adminActivities.loading;
export const selectAdminError = (state: RootState) =>
  state.adminActivities.error;

const initialState: AdminActivitiesState = {
  items: [],
  loading: false,
  error: null,
};

const adminActivitiesSlice = createSlice({
  name: "adminActivities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminActivities.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchAdminActivities.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })

      .addCase(deleteAdminActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (activity) => activity._id !== action.payload.id,
        );
      })
      .addCase(deleteAdminActivity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })

      .addCase(togglePublishedAdminActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishedAdminActivity.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.items.findIndex((act) => act._id === payload._id);
        if (idx !== -1) {
          state.items[idx] = payload;
        }
      })
      .addCase(togglePublishedAdminActivity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      });
  },
});

export const activitiesAdminReducer = adminActivitiesSlice.reducer;
