import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoEllipsisVertical } from "react-icons/io5";
import QuizQuestions from "./QuizQuestions";
import { findQuizById, updateQuiz, createQuiz } from "./client";
import { Quiz } from "./types";

function formatDateForInput(dateString: string | number | Date) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function QuizEditor() {
  const navigate = useNavigate();
  const { cid, qid } = useParams();
  const [activeTab, setActiveTab] = useState("Details");
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quiz = await findQuizById(qid as string);
        setQuizData(quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [qid]);

  const handleSave = async () => {
    if (!quizData) return;
    try {
      setLoading(true);
      if (qid === "new") {
        const newQuiz = await createQuiz(cid as string, quizData);
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else {
        await updateQuiz(qid as string, quizData);
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      setError("Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!quizData) return;
    try {
      await updateQuiz(qid as string, { ...quizData, status: "published" });
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } catch (error) {
      setError("Failed to publish quiz");
      console.error("Error publishing quiz:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!quizData) return <div>No quiz data available</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="mb-2">
            Points {totalPoints}{" "}
            <span className="text-muted">
              {quizData.status === "published" ? "Published" : "Not Published"}
            </span>
          </div>
          <div className="btn-group" role="group">
            <button
              className={`btn ${
                activeTab === "Details" ? "btn-danger" : "btn-light"
              }`}
              onClick={() => setActiveTab("Details")}
            >
              Details
            </button>
            <button
              className={`btn ${
                activeTab === "Questions" ? "btn-danger" : "btn-light"
              }`}
              onClick={() => setActiveTab("Questions")}
            >
              Questions
            </button>
          </div>
        </div>
        <button className="btn btn-light">
          <IoEllipsisVertical />
        </button>
      </div>

      {activeTab === "Details" && (
        <div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Quiz Title"
              value={quizData.title}
              onChange={(e) =>
                setQuizData({ ...quizData, title: e.target.value })
              }
            />
          </div>

          <h5>Quiz Instructions: </h5>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Quiz Instructions"
              value={quizData.description}
              onChange={(e) =>
                setQuizData({ ...quizData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="border rounded p-3 mb-3">
            <div className="mb-3">
              <label className="form-label">Quiz Type</label>
              <select
                className="form-select"
                value={quizData.quizType}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    quizType: e.target.value as Quiz["quizType"],
                  })
                }
              >
                <option value="Graded Quiz">Graded Quiz</option>
                <option value="Practice Quiz">Practice Quiz</option>
                <option value="Graded Survey">Graded Survey</option>
                <option value="Ungraded Survey">Ungraded Survey</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Assignment Group</label>
              <select
                className="form-select"
                value={quizData.assignmentGroup}
                onChange={(e) =>
                  setQuizData({ ...quizData, assignmentGroup: e.target.value })
                }
              >
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>

            {/* Quiz Options */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="shuffleAnswers"
                  checked={quizData.shuffleAnswers}
                  onChange={(e) =>
                    setQuizData({
                      ...quizData,
                      shuffleAnswers: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="shuffleAnswers">
                  Shuffle Answers
                </label>
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="timeLimit"
                  checked={quizData.timeLimit > 0}
                  onChange={(e) => {
                    setQuizData({
                      ...quizData,
                      timeLimit: e.target.checked ? 20 : 0,
                    });
                  }}
                />
                <label className="form-check-label me-2" htmlFor="timeLimit">
                  Time Limit
                </label>
                {quizData.timeLimit > 0 && (
                  <>
                    <input
                      type="number"
                      className="form-control w-25"
                      value={quizData.timeLimit}
                      onChange={(e) =>
                        setQuizData({
                          ...quizData,
                          timeLimit: parseInt(e.target.value) || 0,
                        })
                      }
                      min="1"
                    />
                    <span className="ms-2">Minutes</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="multipleAttempts"
                  checked={quizData.multipleAttempts}
                  onChange={(e) => {
                    setQuizData({
                      ...quizData,
                      multipleAttempts: e.target.checked,
                      attempts: e.target.checked ? quizData.attempts : 1,
                    });
                  }}
                />
                <label
                  className="form-check-label me-2"
                  htmlFor="multipleAttempts"
                >
                  Allow Multiple Attempts
                </label>
                {quizData.multipleAttempts && (
                  <>
                    <span className="ms-2 me-2">Attempts allowed:</span>
                    <input
                      type="number"
                      className="form-control w-25"
                      value={quizData.attempts}
                      onChange={(e) =>
                        setQuizData({
                          ...quizData,
                          attempts: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quiz Dates */}
          <div className="border rounded p-3 mb-3">
            <div className="row">
              <div className="col">
                <label className="form-label">Available from</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formatDateForInput(quizData.availableFrom)}
                  onChange={(e) =>
                    setQuizData({ ...quizData, availableFrom: e.target.value })
                  }
                />
              </div>
              <div className="col">
                <label className="form-label">Until</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formatDateForInput(quizData.until)}
                  onChange={(e) =>
                    setQuizData({ ...quizData, until: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="form-label">Due Date</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formatDateForInput(quizData.dueDate)}
                onChange={(e) =>
                  setQuizData({ ...quizData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-light" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-success" onClick={handleSaveAndPublish}>
              Save & Publish
            </button>
          </div>
        </div>
      )}

      {activeTab === "Questions" && (
        <QuizQuestions
          quizData={quizData}
          onPointsUpdate={setTotalPoints}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
