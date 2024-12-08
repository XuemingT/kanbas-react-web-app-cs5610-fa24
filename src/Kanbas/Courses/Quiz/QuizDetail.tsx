import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findQuizById } from "./client";
import { Quiz } from "./types";
import { format, parseISO } from "date-fns";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaClock, FaCalendarAlt, FaLock, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";

function formatDate(dateString: string) {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  } catch (error) {
    return "Invalid Date";
  }
}

const QuizDetail: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);


  const calculateTotalPoints = (quiz: Quiz) => {
    return quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);
      } catch (error) {
        console.error("Error loading quiz:", error);
        setError("Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [qid]);

  const handleStartQuiz = () => {
    // Navigate to quiz taking interface
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/take`);
  };

  const handlePreviewQuiz = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const handleEditQuiz = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`);
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

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="mb-3">{quiz.title}</h2>
          <div className="text-muted mb-3">
            <span
              className={
                quiz.status === "published" ? "text-success" : "text-danger"
              }
            >
              {quiz.status === "published" ? "Published" : "Not Published"}
            </span>
          </div>
        </div>
        {currentUser.role === "FACULTY" && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={handlePreviewQuiz}
              title="Preview Quiz"
            >
              <FaEye className="me-2" />
              Preview
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleEditQuiz}
              title="Edit Quiz"
            >
              Edit
            </button>
            <button className="btn btn-outline-secondary">
              <IoEllipsisVertical />
            </button>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Quiz Instructions</h5>
              <p className="card-text">
                {quiz.description || "No instructions provided."}
              </p>

              <hr />

              <div className="d-flex align-items-center mb-3">
                <FaClock className="text-secondary me-2" />
                <div>
                  {quiz.timeLimit > 0 ? (
                    <span>Time limit: {quiz.timeLimit} minutes</span>
                  ) : (
                    <span>No time limit</span>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <FaCalendarAlt className="text-secondary me-2" />
                <div>
                  <div>Available from: {formatDate(quiz.availableFrom)}</div>
                  <div>Due: {formatDate(quiz.dueDate)}</div>
                  <div>Until: {formatDate(quiz.until)}</div>
                </div>
              </div>

              {quiz.accessCode && (
                <div className="d-flex align-items-center mb-3">
                  <FaLock className="text-secondary me-2" />
                  <div>Access code required</div>
                </div>
              )}

              <div className="mt-4">
                <h6>Points: {calculateTotalPoints(quiz)}</h6>
                <h6>Questions: {quiz.questions.length}</h6>
                {/* {quiz.multipleAttempts && (
                  <h6>Allowed Attempts: {quiz.attempts}</h6>
                )} */}
                 <h6>Allowed Attempts: {quiz.multipleAttempts ? quiz.attempts : 1}</h6>
              </div>
            </div>
          </div>

          {quiz.status === "published" && (
            <button
              onClick={handlePreviewQuiz}
              className="btn btn-primary btn-lg"
            >
              Start Quiz
            </button>
          )}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quiz Settings</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="fw-bold">Shuffle Answers</div>
                  <div>{quiz.shuffleAnswers ? "Yes" : "No"}</div>
                </li>
                <li className="list-group-item">
                  <div className="fw-bold">Show Questions</div>
                  <div>
                    {quiz.oneQuestionAtATime ? "One at a time" : "All at once"}
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="fw-bold">Lock Questions</div>
                  <div>
                    {quiz.lockQuestionsAfterAnswering
                      ? "After answering"
                      : "Not locked"}
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="fw-bold">Show Correct Answers</div>
                  <div>{quiz.showCorrectAnswers}</div>
                </li>
                {quiz.webcamRequired && (
                  <li className="list-group-item">
                    <div className="fw-bold text-danger">Webcam Required</div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
