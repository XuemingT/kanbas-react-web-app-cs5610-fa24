import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findQuizById } from "./client";
import { Quiz, Question } from "./types";
import { FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);
        // Initialize selected answers with proper typing
        const initialAnswers: Record<string, string | boolean> = {};
        quizData.questions.forEach((q: Question) => {
          initialAnswers[q._id] = q.type === "TRUE_FALSE" ? false : "";
        });
        setSelectedAnswers(initialAnswers);
      } catch (error) {
        console.error("Error loading quiz:", error);
        setError("Failed to load quiz preview");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [qid]);

  const handleExit = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="mb-4">
            <p className="mb-3 fw-bold">{question.question}</p>
            {question.options?.map((option, index) => (
              <div key={index} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${question._id}`}
                  id={`option-${question._id}-${index}`}
                  checked={selectedAnswers[question._id] === option}
                  onChange={() => {
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [question._id]: option,
                    });
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`option-${question._id}-${index}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div className="mb-4">
            <p className="mb-3 fw-bold">{question.question}</p>
            <div className="form-check mb-2">
              <input
                type="radio"
                className="form-check-input"
                name={`question-${question._id}`}
                id={`true-${question._id}`}
                checked={selectedAnswers[question._id] === true}
                onChange={() => {
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [question._id]: true,
                  });
                }}
              />
              <label
                className="form-check-label"
                htmlFor={`true-${question._id}`}
              >
                True
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name={`question-${question._id}`}
                id={`false-${question._id}`}
                checked={selectedAnswers[question._id] === false}
                onChange={() => {
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [question._id]: false,
                  });
                }}
              />
              <label
                className="form-check-label"
                htmlFor={`false-${question._id}`}
              >
                False
              </label>
            </div>
          </div>
        );

      case "FILL_BLANK":
        return (
          <div className="mb-4">
            <p className="mb-3 fw-bold">{question.question}</p>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your answer"
              value={selectedAnswers[question._id] as string}
              onChange={(e) => {
                setSelectedAnswers({
                  ...selectedAnswers,
                  [question._id]: e.target.value,
                });
              }}
            />
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
        <><h3>Preview: {quiz.title}</h3><button className="btn btn-outline-danger" onClick={handleExit}>
            Exit Preview
          </button></>)}
      </div>

      <div className="row">
        <div className="col-md-8">
          {/* Quiz Content */}
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
          {/* Question Navigator */}
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Questions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`btn ${currentQuestionIndex === index
                        ? "btn-primary"
                        : selectedAnswers[quiz.questions[index]._id]
                          ? "btn-success"
                          : "btn-outline-secondary"
                      }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Info */}
          {currentUser.role === "FACULTY" && (
            <div className="alert alert-info mt-4">
              <h6 className="alert-heading">Preview Mode</h6>
              <p className="mb-0 small">
                This is a preview of how students will see the quiz. Answers are not
                saved in preview mode.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;
