import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuizzes } from "./reducer";
import { findQuizzesForCourse } from "./client";
import { RootState } from "../../store";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import QuizControlButton from "./QuizControlButton";
import { format, parseISO } from "date-fns";
import { Quiz } from "./types";

function formatDate(dateString: string) {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d 'at' h:mm a");
  } catch (error) {
    return "Invalid Date";
  }
}

const QuizList: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);


  const allQuizzes = useSelector((state: RootState) =>
    state.quizzesReducer.quizzes.filter((quiz) => quiz.course === cid)
  );

  const filteredQuizzes = allQuizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalPoints = (quiz: Quiz) => {
    return quiz.questions.reduce(
      (sum, question) => sum + (question.points || 0),
      0
    );
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching quizzes for course:", cid); // Add this
      const response = await findQuizzesForCourse(cid as string);
      console.log("Response:", response); // Add this
      dispatch(setQuizzes(response));
    } catch (error) {
      console.error("Error details:", error); // Make this more detailed
      setError("Failed to load quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

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

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-link" onClick={fetchQuizzes}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="wd-assignments" className="px-4">
      <QuizControlButton onSearch={handleSearch} />

      <div className="mt-4">
        <ul className="list-group rounded-0">
          <li className="list-group-item p-0 border-start-0 border-end-0">
            <div className="p-3 bg-light d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-3 text-secondary" />
                <h5 className="mb-0">ASSIGNMENT QUIZZES</h5>
              </div>
            </div>

            <ul className="list-group rounded-0">
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <li
                    key={quiz._id}
                    className="list-group-item p-4 border-start-0 border-end-0"
                  // style={{
                  //   borderLeft: "4px solid green",
                  // }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <BsGripVertical className="me-3 text-secondary" />
                        <FaBook className="me-3 text-success" />
                        <div>
                          {/* <Link
                            to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                            className="text-decoration-none"
                          >
                            <h6 className="mb-1">{quiz.title}</h6>
                          </Link> */}
                          {currentUser.role === "FACULTY" ? (
                            <Link
                              to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                              className="text-decoration-none"
                            >
                              <h6 className="mb-1">{quiz.title}</h6>
                            </Link>
                          ) : (
                            <Link
                              to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/preview`}
                              className="text-decoration-none"
                            >
                              <h6 className="mb-1">{quiz.title}</h6>
                            </Link>
                          )}
                          <div className="text-muted small">
                            <span
                              className={`me-2 ${quiz.status === "published"
                                ? "text-success"
                                : "text-danger"
                                }`}
                            >
                              {quiz.status === "published"
                                ? "✓ Published"
                                : "Not Published"}
                            </span>
                            {quiz.dueDate && (
                              <>
                                | <strong>Due</strong>{" "}
                                {formatDate(quiz.dueDate)}
                              </>
                            )}
                            | <strong>Points</strong>{" "}
                            {calculateTotalPoints(quiz)}
                          </div>
                          <div className="text-muted small mt-1">
                            Available from {formatDate(quiz.availableFrom)}{" "}
                            until {formatDate(quiz.until)}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {/* <button
                          className="btn btn-link p-0 me-3"
                          title="More options"
                        >
                          <IoEllipsisVertical />
                        </button> */}
                        {currentUser.role === "FACULTY" && (
                          <div className="dropdown">
                            <button
                              className="btn btn-light"
                              type="button"
                              id="dropdownMenuButton"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <IoEllipsisVertical />
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <li>
                                <button className="dropdown-item">Edit</button>
                                <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                                  Edit Quiz
                                </Link>
                              </li>
                              <li>
                                <button className="dropdown-item">Delete</button>
                              </li>
                              <li>
                                <button className="dropdown-item">Publish</button>
                              </li>
                              <li>
                                <button className="dropdown-item">Copy</button>
                              </li>
                              <li>
                                <button className="dropdown-item">Sort</button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item p-4 text-center text-muted">
                  {searchTerm
                    ? "No quizzes match your search"
                    : "No quizzes available for this course"}
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuizList;
