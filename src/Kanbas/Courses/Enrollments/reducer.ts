// Enrollments/reducer.ts
import { createSlice } from "@reduxjs/toolkit";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
  showAllCourses: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  showAllCourses: false,
  loading: false,
  error: null,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
      state.loading = false;
      state.error = null;
    },
    toggleShowAllCourses: (state) => {
      state.showAllCourses = !state.showAllCourses;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    enrollInCourse: (state, action) => {
      state.enrollments.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    unenrollFromCourse: (state, action) => {
      const { userId, courseId } = action.payload;
      state.enrollments = state.enrollments.filter(
        (enrollment) =>
          !(enrollment.user === userId && enrollment.course === courseId)
      );
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setEnrollments,
  toggleShowAllCourses,
  setLoading,
  setError,
  enrollInCourse,
  unenrollFromCourse,
} = enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;
