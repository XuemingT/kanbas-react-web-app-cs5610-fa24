import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoEllipsisVertical } from "react-icons/io5";
import QuizQuestions from "./QuizQuestions";

interface QuizData {
  title: string;
  description: string;
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableFrom: string;
  until: string;
}

export default function QuizEditor() {
  const navigate = useNavigate();
  const { cid } = useParams();
  const [activeTab, setActiveTab] = useState("Details");
  const [totalPoints, setTotalPoints] = useState(0);

  const [quizData, setQuizData] = useState<QuizData>({
    title: "Unnamed Quiz",
    description: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableFrom: "",
    until: "",
  });

  const handleSave = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizData.title}`);
  };

  const handleSaveAndPublish = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  const handlePointsUpdate = (points: number) => {
    setTotalPoints(points);
    setQuizData({ ...quizData, points: points });
  };

  return (
    <div className="p-4">
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ borderBottom: "1px solid #dee2e6", paddingBottom: "10px" }}
      >
        <div>
          <div className="mb-2">
            Points {totalPoints}{" "}
            <span className="text-muted">Not Published</span>
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
        <div>
          <button className="btn btn-light">
            <IoEllipsisVertical />
          </button>
        </div>
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
                  setQuizData({ ...quizData, quizType: e.target.value })
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

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="shuffleAnswers"
                checked={quizData.shuffleAnswers}
                onChange={(e) =>
                  setQuizData({ ...quizData, shuffleAnswers: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="shuffleAnswers">
                Shuffle Answers
              </label>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="timeLimit"
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setQuizData({ ...quizData, timeLimit: 0 });
                    } else {
                      setQuizData({ ...quizData, timeLimit: 20 });
                    }
                  }}
                  checked={quizData.timeLimit > 0}
                />
                <label className="form-check-label" htmlFor="timeLimit">
                  Time Limit
                </label>
              </div>
              {quizData.timeLimit > 0 && (
                <div className="d-flex align-items-center mt-2">
                  <input
                    type="number"
                    className="form-control w-25"
                    value={quizData.timeLimit}
                    onChange={(e) =>
                      setQuizData({
                        ...quizData,
                        timeLimit: parseInt(e.target.value),
                      })
                    }
                  />
                  <span className="ms-2">Minutes</span>
                </div>
              )}
            </div>

            {/* Add other options here */}
          </div>

          <div className="border rounded p-3 mb-3">
            <h6>Assign</h6>
            <div className="mb-3">
              <label className="form-label">Due</label>
              <input
                type="datetime-local"
                className="form-control"
                value={quizData.dueDate}
                onChange={(e) =>
                  setQuizData({ ...quizData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="row">
              <div className="col">
                <label className="form-label">Available from</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={quizData.availableFrom}
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
                  value={quizData.until}
                  onChange={(e) =>
                    setQuizData({ ...quizData, until: e.target.value })
                  }
                />
              </div>
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
          onPointsUpdate={handlePointsUpdate}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
