import axios from "axios";
import { Quiz, Question, QuizAttempt } from "./types";
const REMOTE_SERVER =
  process.env.REACT_APP_REMOTE_SERVER || "http://localhost:4000";
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

// Find all quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

// Find quiz by ID
export const findQuizById = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Create new quiz
export const createQuiz = async (courseId: string, quiz: Partial<Quiz>) => {
  try {
    const response = await axios.post(
      `${COURSES_API}/${courseId}/quizzes`,
      quiz
    );
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Update quiz
export const updateQuiz = async (quizId: string, quiz: any) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

// Delete quiz
export const deleteQuiz = async (quizId: string) => {
  console.log("Deleting quiz with ID:", quizId); // Add this for debugging
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Add question to quiz
export const addQuestionToQuiz = async (quizId: string, question: any) => {
  const response = await axios.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return response.data;
};

// Update question in quiz
export const updateQuizQuestion = async (
  quizId: string,
  questionId: string,
  question: any
) => {
  const response = await axios.put(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`,
    question
  );
  return response.data;
};

// Delete question from quiz
export const deleteQuizQuestion = async (
  quizId: string,
  questionId: string
) => {
  const response = await axios.delete(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`
  );
  return response.data;
};

// Update quiz status
export const updateQuizStatus = async (quizId: string, status: string) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/status`, {
    status,
  });
  return response.data;
};
// for quiz attempt
export const createQuizAttempt = async (
  quizId: string,
  attemptData: Partial<QuizAttempt>
) => {
  const response = await axios.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    attemptData
  );
  return response.data;
};

export const getUserAttempts = async (quizId: string, userId: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/attempts/${userId}`
  );
  return response.data;
};

export const submitQuizAttempt = async (
  attemptId: string,
  data: Partial<QuizAttempt>
) => {
  const response = await axios.put(
    `${QUIZZES_API}/attempts/${attemptId}`,
    data
  );
  return response.data;
};
