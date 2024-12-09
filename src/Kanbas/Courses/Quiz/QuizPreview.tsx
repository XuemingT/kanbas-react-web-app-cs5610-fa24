import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  findQuizById,
  createQuizAttempt,
  getUserAttempts,
  submitQuizAttempt,
} from "./client";
import { Quiz, Question, QuizAttempt, QuizAnswer } from "./types";
import {
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const QuizPreview: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string | boolean>
  >({});
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);
  const [attemptScore, setAttemptScore] = useState<number | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);

        // Load previous attempt if exists
        if (currentUser) {
          const attempts: QuizAttempt[] = await getUserAttempts(
            qid as string,
            currentUser._id
          );
          if (attempts.length > 0) {
            setCurrentAttempt(attempts[0]);
            const answerMap = Object.fromEntries(
              attempts[0].answers.map((ans) => [ans.questionId, ans.answer])
            );
            setSelectedAnswers(answerMap);
            setAttemptScore(attempts[0].score);
            setSubmitted(true);
          }
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        setError("Failed to load quiz preview");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [qid, currentUser]);

  const handleSubmit = async () => {
    if (!quiz || !currentUser) return;

    const answers: QuizAnswer[] = quiz.questions.map((q) => ({
      questionId: q._id,
      answer: selectedAnswers[q._id],
      isCorrect: selectedAnswers[q._id] === q.correctAnswer,
    }));

    const score = answers.reduce((sum, ans) => {
      const question = quiz.questions.find((q) => q._id === ans.questionId);
      return ans.isCorrect ? sum + (question?.points || 0) : sum;
    }, 0);

    const attemptData: Partial<QuizAttempt> = {
      quizId: quiz._id,
      userId: currentUser._id,
      userRole: currentUser.role,
      answers,
      score,
      totalPoints: quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0),
      isPreview: currentUser.role === "FACULTY",
    };

    try {
      if (currentAttempt) {
        const updatedAttempt = await submitQuizAttempt(
          currentAttempt._id,
          attemptData
        );
        setCurrentAttempt(updatedAttempt);
      } else {
        const newAttempt = await createQuizAttempt(quiz._id, attemptData);
        setCurrentAttempt(newAttempt);
      }
      setAttemptScore(score);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz");
    }
  };

  const renderQuestion = (question: Question) => {
    const isAnswerCorrect = currentAttempt?.answers.find(
      (a) => a.questionId === question._id
    )?.isCorrect;

    const answerStatus = submitted && (
      <span
        className={`ms-2 ${isAnswerCorrect ? "text-success" : "text-danger"}`}
      >
        {isAnswerCorrect ? <FaCheck /> : <FaTimes />}
      </span>
    );

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="mb-4">
            <p className="mb-3 fw-bold">
              {question.question}
              {answerStatus}
            </p>
            {question.options?.map((option, index) => (
              <div key={index} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${question._id}`}
                  id={`option-${question._id}-${index}`}
                  checked={selectedAnswers[question._id] === option}
                  onChange={() => {
                    if (!submitted) {
                      setSelectedAnswers({
                        ...selectedAnswers,
                        [question._id]: option,
                      });
                    }
                  }}
                  disabled={submitted}
                />
                <label
                  className="form-check-label"
                  htmlFor={`option-${question._id}-${index}`}
                >
                  {option}
                </label>
                {submitted && option === question.correctAnswer && (
                  <span className="text-success ms-2">(Correct Answer)</span>
                )}
              </div>
            ))}
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div className="mb-4">
            <p className="mb-3 fw-bold">
              {question.question}
              {answerStatus}
            </p>
            {["true", "false"].map((option) => (
              <div key={option} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${question._id}`}
                  id={`${option}-${question._id}`}
                  checked={
                    selectedAnswers[question._id] === (option === "true")
                  }
                  onChange={() => {
                    if (!submitted) {
                      setSelectedAnswers({
                        ...selectedAnswers,
                        [question._id]: option === "true",
                      });
                    }
                  }}
                  disabled={submitted}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${option}-${question._id}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
                {submitted && option === String(question.correctAnswer) && (
                  <span className="text-success ms-2">(Correct Answer)</span>
                )}
              </div>
            ))}
          </div>
        );

      case "FILL_BLANK":
        return (
          <div className="mb-4">
            <p className="mb-3 fw-bold">
              {question.question}
              {answerStatus}
            </p>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your answer"
              value={(selectedAnswers[question._id] as string) || ""}
              onChange={(e) => {
                if (!submitted) {
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [question._id]: e.target.value,
                  });
                }
              }}
              disabled={submitted}
            />
            {submitted && (
              <div className="text-success mt-2">
                Correct Answer: {question.correctAnswer as string}
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          {error || "Quiz not found"}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {currentUser.role === "FACULTY" && (
          <>
            <h3>Preview: {quiz.title}</h3>
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`)}
            >
              Exit Preview
            </button>
          </>
        )}
      </div>

      {submitted && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Quiz Results</h3>
            <div className="text-center">
              <h4>
                Your Score: {attemptScore} out of{" "}
                {quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0)}
              </h4>
              <p className="text-muted">
                Percentage:{" "}
                {(
                  ((attemptScore || 0) /
                    quiz.questions.reduce(
                      (sum, q) => sum + (q.points || 0),
                      0
                    )) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <span>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              {quiz.timeLimit > 0 && (
                <span>
                  <FaClock className="me-2" />
                  Time limit: {quiz.timeLimit} minutes
                </span>
              )}
            </div>
            <div className="card-body">
              {currentQuestion && renderQuestion(currentQuestion)}
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  <FaChevronLeft className="me-1" /> Previous
                </button>
                {!submitted &&
                  currentQuestionIndex === quiz.questions.length - 1 && (
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Submit Quiz
                    </button>
                  )}
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                >
                  Next <FaChevronRight className="ms-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Questions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {quiz.questions.map((_, index) => {
                  const questionAttempt = currentAttempt?.answers[index];
                  let buttonClass = "btn ";
                  if (currentQuestionIndex === index) {
                    buttonClass += "btn-primary";
                  } else if (submitted && questionAttempt) {
                    buttonClass += questionAttempt.isCorrect
                      ? "btn-success"
                      : "btn-danger";
                  } else if (selectedAnswers[quiz.questions[index]._id]) {
                    buttonClass += "btn-secondary";
                  } else {
                    buttonClass += "btn-outline-secondary";
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {currentUser.role === "FACULTY" && !submitted && (
            <div className="alert alert-info mt-4">
              <h6 className="alert-heading">Preview Mode</h6>
              <p className="mb-0 small">
                This is a preview of how students will see the quiz. Your
                answers will be saved for future reference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;
