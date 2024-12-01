import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, Quiz } from "./types";

// Define interface for quiz state
interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  selectedQuiz: Quiz | null;
}

// Define initial state
const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
  selectedQuiz: null,
};

// Define interfaces for payload actions
interface UpdateQuestionPayload {
  quizId: string;
  question: Question;
}

interface DeleteQuestionPayload {
  quizId: string;
  questionId: string;
}

interface SetQuizStatusPayload {
  quizId: string;
  status: "draft" | "published";
}

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      // Clear error when starting new operation
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.selectedQuiz = action.payload;
    },

    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload);
      state.error = null;
    },

    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload
      );
      if (state.selectedQuiz?._id === action.payload) {
        state.selectedQuiz = null;
      }
    },

    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
        if (state.selectedQuiz?._id === action.payload._id) {
          state.selectedQuiz = action.payload;
        }
      }
    },

    setQuizStatus: (state, action: PayloadAction<SetQuizStatusPayload>) => {
      const { quizId, status } = action.payload;
      const quiz = state.quizzes.find((q) => q._id === quizId);
      if (quiz) {
        quiz.status = status;
        if (state.selectedQuiz?._id === quizId) {
          state.selectedQuiz.status = status;
        }
      }
    },

    updateQuizQuestion: (
      state,
      action: PayloadAction<UpdateQuestionPayload>
    ) => {
      const { quizId, question } = action.payload;
      const quiz = state.quizzes.find((q) => q._id === quizId);
      if (quiz) {
        const questionIndex = quiz.questions.findIndex(
          (q) => q._id === question._id
        );
        if (questionIndex !== -1) {
          quiz.questions[questionIndex] = question;
          if (state.selectedQuiz?._id === quizId) {
            state.selectedQuiz.questions[questionIndex] = question;
          }
        }
      }
    },

    addQuizQuestion: (state, action: PayloadAction<UpdateQuestionPayload>) => {
      const { quizId, question } = action.payload;
      const quiz = state.quizzes.find((q) => q._id === quizId);
      if (quiz) {
        quiz.questions.push(question);
        if (state.selectedQuiz?._id === quizId) {
          state.selectedQuiz.questions.push(question);
        }
      }
    },

    deleteQuizQuestion: (
      state,
      action: PayloadAction<DeleteQuestionPayload>
    ) => {
      const { quizId, questionId } = action.payload;
      const quiz = state.quizzes.find((q) => q._id === quizId);
      if (quiz) {
        quiz.questions = quiz.questions.filter((q) => q._id !== questionId);
        if (state.selectedQuiz?._id === quizId) {
          state.selectedQuiz.questions = state.selectedQuiz.questions.filter(
            (q) => q._id !== questionId
          );
        }
      }
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setQuizzes,
  setSelectedQuiz,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  setQuizStatus,
  updateQuizQuestion,
  addQuizQuestion,
  deleteQuizQuestion,
} = quizzesSlice.actions;

// Export reducer
export default quizzesSlice.reducer;

// Selector functions
export const selectAllQuizzes = (state: { quizzesReducer: QuizState }) =>
  state.quizzesReducer.quizzes;
export const selectQuizById = (
  state: { quizzesReducer: QuizState },
  quizId: string
) => state.quizzesReducer.quizzes.find((quiz) => quiz._id === quizId);
export const selectQuizLoading = (state: { quizzesReducer: QuizState }) =>
  state.quizzesReducer.loading;
export const selectQuizError = (state: { quizzesReducer: QuizState }) =>
  state.quizzesReducer.error;
export const selectSelectedQuiz = (state: { quizzesReducer: QuizState }) =>
  state.quizzesReducer.selectedQuiz;
