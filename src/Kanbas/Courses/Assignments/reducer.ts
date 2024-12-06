// assignments/reducer.ts
import { createSlice } from "@reduxjs/toolkit";
import { Assignment } from "./types";

interface AssignmentsState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentsState = {
  assignments: [],
  loading: false,
  error: null,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload }: { payload: Assignment[] }) => {
      state.assignments = payload;
      state.loading = false;
      state.error = null;
    },
    addAssignment: (state, { payload }: { payload: Assignment }) => {
      state.assignments.push(payload);
      state.loading = false;
      state.error = null;
    },
    deleteAssignment: (
      state,
      { payload: assignmentId }: { payload: string }
    ) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== assignmentId
      );
      state.loading = false;
      state.error = null;
    },
    updateAssignment: (
      state,
      { payload: assignment }: { payload: Assignment }
    ) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignment._id ? { ...a, ...assignment } : a
      );
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, { payload }: { payload: string }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const {
  setAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setLoading,
  setError,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
