import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../Database";
import { Assignment } from "./types";

interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: assignments as Assignment[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload }: { payload: Assignment }) => {
      const newAssignment = {
        ...payload,
        _id: new Date().getTime().toString(),
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (
      state,
      { payload: assignmentId }: { payload: string }
    ) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== assignmentId
      );
    },
    updateAssignment: (
      state,
      { payload: assignment }: { payload: Assignment }
    ) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignment._id ? { ...a, ...assignment } : a
      );
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
