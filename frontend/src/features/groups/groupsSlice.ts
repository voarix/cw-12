import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { GlobalError, IGroup, ValidationError } from "../../types";
import {
  addParticipant,
  fetchGroupByActivityId,
  fetchMyParticipatedGroups,
  removeParticipant,
} from "./groupsThunks.ts";

interface GroupsState {
  participatedGroups: IGroup[];
  oneGroup: IGroup | null;

  fetchLoading: boolean;
  fetchError: ValidationError | GlobalError | null;

  removeLoading: boolean;
  removeError: GlobalError | null;
}

export const selectParticipatedGroups = (state: RootState) =>
  state.groups.participatedGroups;
export const selectGroup = (state: RootState) => state.groups.oneGroup;
export const selectGroupsLoading = (state: RootState) =>
  state.groups.fetchLoading;

const initialState: GroupsState = {
  participatedGroups: [],
  oneGroup: null,

  fetchLoading: false,
  fetchError: null,

  removeLoading: false,
  removeError: null,
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupByActivityId.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchGroupByActivityId.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.oneGroup = payload;
      })
      .addCase(fetchGroupByActivityId.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.fetchError = payload || null;
        state.oneGroup = null;
      })

      .addCase(fetchMyParticipatedGroups.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchMyParticipatedGroups.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.participatedGroups = payload;
      })
      .addCase(fetchMyParticipatedGroups.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.fetchError = payload || null;
      })

      .addCase(addParticipant.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(addParticipant.fulfilled, (state) => {
        state.fetchLoading = false;
      })
      .addCase(addParticipant.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.fetchError = payload || null;
      })

      .addCase(removeParticipant.pending, (state) => {
        state.removeLoading = true;
        state.removeError = null;
      })
      .addCase(removeParticipant.fulfilled, (state) => {
        state.removeLoading = false;
      })
      .addCase(removeParticipant.rejected, (state, { payload }) => {
        state.removeLoading = false;
        state.removeError = payload || null;
      });
  },
});

export const groupsReducer = groupsSlice.reducer;
