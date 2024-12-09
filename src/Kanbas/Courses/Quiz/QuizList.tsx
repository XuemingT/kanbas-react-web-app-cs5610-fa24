import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuizStatus, setQuizzes, updateQuiz } from "./reducer";
import { deleteQuiz } from "./reducer";
import { deleteQuiz as deleteQuizAPI } from "./client";
import { findQuizzesForCourse, updateQuizStatus } from "./client";
import { RootState } from "../../store";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaBan, FaBook } from "react-icons/fa";
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
  const handleDeleteQuiz = async (quizId: string) => {
    try {
      // Make the API call first using the API function
      await deleteQuizAPI(quizId);
      // Then update Redux state using the action creator
      dispatch(deleteQuiz(quizId));
      // Finally refresh the quiz list
      await fetchQuizzes();
    } catch (error) {
      console.log("Error deleting quiz:", error);
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

  // const handlePublishToggle = (quizId: string, currentStatus: string) => {
  //   const newStatus = currentStatus === "published" ? "draft" : "published";
  //   dispatch(setQuizStatus({ quizId, status: newStatus }));
  // };
  const handlePublishToggle = async (quizId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      // Call the API to update the status
      const updatedQuiz = await updateQuizStatus(quizId, newStatus);

      // Update Redux state with the new status
      dispatch(setQuizStatus({ quizId, status: updatedQuiz.status }));
    } catch (error) {
      console.error("Failed to update quiz status:", error);
      // Optionally, show an error message to the user
    }
  };

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
                          <Link
                            to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                            className="text-decoration-none"
                          >
                            <h6 className="mb-1">{quiz.title}</h6>
                          </Link>
                          {/* {currentUser.role === "FACULTY" ? (
                            <Link
                              to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                              className="text-decoration-none"
                            >
                              <h6 className="mb-1">{quiz.title}</h6>
                            </Link>
                          ) : (
                            <Link
                              to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/quizDetail`}
                              className="text-decoration-none"
                            >
                              <h6 className="mb-1">{quiz.title}</h6>
                            </Link>
                          )} */}
                          <div className="text-muted small d-flex align-items-center">
                            {/* <span
                              className={`me-2 ${quiz.status === "published"
                                ? "text-success"
                                : "text-danger"
                                }`}
                            >
                              {quiz.status === "published"
                                ? "✓ Published"
                                : "Not Published"}
                            </span> */}
                            <div className="text-muted small">
                              <div className="text-muted small">
                                <span
                                  className={`me-2 ${
                                    quiz.status === "published"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handlePublishToggle(quiz._id, quiz.status)
                                  }
                                  title={
                                    quiz.status === "published"
                                      ? "Unpublish Quiz"
                                      : "Publish Quiz"
                                  }
                                >
                                  {quiz.status === "published" ? (
                                    "✓"
                                  ) : (
                                    <FaBan />
                                  )}{" "}
                                  {/* Display 🚫 for "Not Published" */}
                                </span>
                              </div>
                            </div>
                            {quiz.dueDate && (
                              <>
                                | <strong>Due: </strong>{" "}
                                {formatDate(quiz.dueDate)}
                              </>
                            )}
                            | {calculateTotalPoints(quiz)} Points |{" "}
                            {quiz.questions.length} Questions
                          </div>
                          <div className="text-muted small mt-1">
                            Available from: {formatDate(quiz.availableFrom)}{" "}
                            until: {formatDate(quiz.until)}
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
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <li>
                                <Link
                                  to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                                >
                                  <button className="dropdown-item">
                                    Edit
                                  </button>
                                </Link>
                              </li>
                              <li>
                                {/* <button className="dropdown-item">Delete</button> */}
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDeleteQuiz(quiz._id)}
                                >
                                  Delete
                                </button>
                              </li>
                              {/* <li>
                                <button className="dropdown-item">
                                  {quiz.status === "published" ? "Unpublish" : "Publish"}
                                </button>
                              </li> */}
                              {/* <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handlePublishToggle(quiz._id, quiz.status === "published" ? "draft" : "published")
                                  }
                                >
                                  {quiz.status === "published" ? "Unpublish" : "Publish"}
                                </button>
                              </li> */}
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handlePublishToggle(quiz._id, quiz.status)
                                  }
                                >
                                  {quiz.status === "published"
                                    ? "Unpublish"
                                    : "Publish"}
                                </button>
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
