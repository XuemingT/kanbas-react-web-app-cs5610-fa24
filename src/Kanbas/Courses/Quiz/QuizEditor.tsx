import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoEllipsisVertical } from "react-icons/io5";
import QuizQuestions from "./QuizQuestions";
import * as db from "../../Database";


// Function to format date for input: remove the second part of the time
function formatDateForInput(dateString: string | number | Date) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// interface QuizData {
//   title: string;
//   description: string;
//   quizType: string;
//   points: number;
//   assignmentGroup: string;
//   shuffleAnswers: boolean;
//   timeLimit: number;
//   multipleAttempts: boolean;
//   showCorrectAnswers: string;
//   accessCode: string;
//   oneQuestionAtATime: boolean;
//   webcamRequired: boolean;
//   lockQuestionsAfterAnswering: boolean;
//   dueDate: string;
//   availableDate: string;
//   untilDate: string;
// }

export default function QuizEditor() {
  const navigate = useNavigate();
  const { cid, qid } = useParams();
  const [activeTab, setActiveTab] = useState("Details");
  const [totalPoints, setTotalPoints] = useState(0);

  // Find the specific quiz based on course ID and quiz ID
  const quizData = db.quizzes.find(
    (quizData) => quizData._id === qid && quizData.course === cid
  );

  console.log("cid:", cid);
  console.log("qid:", qid);
  console.log("quiz:", quizData);
  if (!quizData) {
    return <div>Quiz not found</div>;
  }

  // const [quizData, setQuizData] = useState<QuizData>({
  //   title: "Unnamed Quiz",
  //   description: "",
  //   quizType: "Graded Quiz",
  //   points: 0,
  //   assignmentGroup: "QUIZZES",
  //   shuffleAnswers: true,
  //   timeLimit: 20,
  //   multipleAttempts: false,
  //   showCorrectAnswers: "Immediately",
  //   accessCode: "",
  //   oneQuestionAtATime: true,
  //   webcamRequired: false,
  //   lockQuestionsAfterAnswering: false,
  //   dueDate: "",
  //   availableDate: "",
  //   untilDate: "",
  // });

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
    // setQuizData({ ...quizData, points: points });
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
              className={`btn ${activeTab === "Details" ? "btn-danger" : "btn-light"
                }`}
              onClick={() => setActiveTab("Details")}
            >
              Details
            </button>
            <button
              className={`btn ${activeTab === "Questions" ? "btn-danger" : "btn-light"
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
            // onChange={(e) =>
            //   setQuizData({ ...quizData, title: e.target.value })
            // }
            />
          </div>

          <h5>Quiz Instructions: </h5>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Quiz Instructions"
              value={quizData.description}
              // onChange={(e) =>
              //   setQuizData({ ...quizData, description: e.target.value })
              // }
              rows={4}
            />
          </div>

          <div className="border rounded p-3 mb-3">
            <div className="mb-3">
              <label className="form-label">Quiz Type</label>
              <select
                className="form-select"
                value={quizData.quizType}
              // onChange={(e) =>
              //   setQuizData({ ...quizData, quizType: e.target.value })
              // }
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
              // onChange={(e) =>
              //   setQuizData({ ...quizData, assignmentGroup: e.target.value })
              // }
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
              // onChange={(e) =>
              //   setQuizData({ ...quizData, shuffleAnswers: e.target.checked })
              // }
              />
              <label className="form-check-label" htmlFor="shuffleAnswers">
                Shuffle Answers
              </label>
            </div>
            <div className="mb-3">
              <div className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="timeLimit"
                // onChange={(e) => {
                //   if (!e.target.checked) {
                //     setQuizData({ ...quizData, timeLimit: 0 });
                //   } else {
                //     setQuizData({ ...quizData, timeLimit: 20 });
                //   }
                // }}
                // checked={quizData.timeLimit > 0}
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
                    // onChange={(e) =>
                    //   setQuizData({
                    //     ...quizData,
                    //     timeLimit: parseInt(e.target.value),
                    //   })
                    // }
                    />
                    <span className="ms-2">Minutes</span>
                  </>
                )}
              </div>
            </div>
            <div className="mb-3">
              {/* Allow Multiple Attempts Checkbox */}
              <div className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="multipleAttempts"
                  // onChange={(e) => {
                  //   setQuizData({ ...quizData, multipleAttempts: e.target.checked });
                  //   if (!e.target.checked) {
                  //     setQuizData({ ...quizData, howManyAttempts: 1 });
                  //   }
                  // }}
                  checked={quizData.multipleAttempts}
                />
                <label className="form-check-label me-2" htmlFor="multipleAttempts">
                  Allow Multiple Attempts
                </label>
                {quizData.multipleAttempts && (
                  <>
                    <span className="ms-2 me-2">Attempts allowed:</span>
                    <input
                      type="number"
                      className="form-control w-25"
                      value={quizData.howManyAttempts}
                      // onChange={(e) =>
                      //   setQuizData({
                      //     ...quizData,
                      //     howManyAttempts: parseInt(e.target.value),
                      //   })
                      // }
                      min="1"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Add other options here */}
          </div>

          <div className="border rounded p-3 mb-3">

            <div className="row">
              <div className="col">
                <label className="form-label">Available from</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formatDateForInput(quizData.availableDate)}
                // onChange={(e) =>
                //   setQuizData({ ...quizData, availableDate: e.target.value })
                // }
                />
              </div>
              <div className="col">
                <label className="form-label">Until</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formatDateForInput(quizData.untilDate)}
                // onChange={(e) =>
                //   setQuizData({ ...quizData, untilDate: e.target.value })
                // }
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
