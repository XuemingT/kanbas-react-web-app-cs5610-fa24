export interface Question {
  _id: string;
  question: string;
  points: number;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  options?: string[];
  correctAnswer: string | boolean | null;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  status: "draft" | "published";
  quizType:
    | "Graded Quiz"
    | "Practice Quiz"
    | "Graded Survey"
    | "Ungraded Survey";
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attempts: number;
  showCorrectAnswers: "Immediately" | "After Submission" | "Never";
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableFrom: string;
  until: string;
  questions: Question[];
  points: number;
  howManyAttempts?: number;
}

// Add these interfaces to your types.ts
export interface QuizAnswer {
  questionId: string;
  answer: string | boolean;
  isCorrect: boolean;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  userRole: "FACULTY" | "STUDENT";
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  startTime: string;
  endTime: string;
  isPreview?: boolean;
}
