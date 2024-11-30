import React from "react";
import { Link, useParams } from "react-router-dom";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import QuizControlButton from "./QuizControlButton";
import * as db from "../../Database";
import LessonControlButtons from "../Modules/LessonControlButtons";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import ModulesControls from "../Modules/ModulesControls";

// interface Quiz {
//   _id: string;
//   title: string;
//   status: string;
//   dueDate: string;
//   timeLimit: string;
//   questions: number;
//   points: number;
  // _id: string; // Changed from _id: string to id: number
  // course: string;
  // quizTitle: string; // Changed from title: string to quizTitle: string
  // quizType: string;
  // points: number;
  // assignmentGroup: string;
  // shuffleAnswers: boolean;
  // timeLimit: string;
  // multipleAttempts: boolean;
  // howManyAttempts: number;
  // showCorrectAnswers: string;
  // accessCode: string;
  // oneQuestionAtATime: boolean;
  // webcamRequired: boolean;
  // lockQuestionsAfterAnswering: boolean;
  // dueDate: string;
  // availableDate: string;
  // untilDate: string;
// }
export default function QuizList() {
  const { cid } = useParams<{ cid: string }>();
  const quizzes = db.quizzes.filter(
    (quiz) => quiz.course === cid
  );

  // Sample data - replace with your actual data source
  // const quizzes: Quiz[] = [
  //   {
  //     _id: "q1",
  //     title: "Q1 - HTML",
  //     status: "Closed",
  //     dueDate: "Sep 29 at 1pm",
  //     timeLimit: "29 pts",
  //     questions: 11,
  //     points: 29,
  //   },
  //   {
  //     _id: "q2",
  //     title: "Q2 - CSS",
  //     status: "Closed",
  //     dueDate: "Oct 5 at 1pm",
  //     timeLimit: "32 pts",
  //     questions: 7,
  //     points: 32,
  //   },
  //   {
  //     _id: "q3",
  //     title: "EXAM 1 FA 23",
  //     status: "Closed",
  //     dueDate: "Oct 4 at 4:50pm",
  //     timeLimit: "135 pts",
  //     questions: 20,
  //     points: 135,
  //   },
  // ];

  return (
    <div id="wd-assignments" className="px-4">
      <QuizControlButton />

      <ul id="wd-assignments-titles" className="list-group rounded-0">
        <li className="wd-assignments-title list-group-item p-0 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-3 fs-3" />
              ASSIGNMENT QUIZZES
            </div>
          </div>

          <ul className="wd-assignment list-group rounded-0">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="wd-assignment list-group-item p-4"
                  style={{
                    paddingLeft: "20px", // Ensure padding does not interfere with border
                    border: "1px solid #ddd", // Main border around the item
                    borderLeft: "4px solid green", // Green left border
                    marginBottom: "0", // Remove margin between assignments
                    borderTop: "none", // Remove top border to eliminate double lines
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    {" "}
                    <div className="d-flex align-items-center">
                      <BsGripVertical className="me-3 fs-3" />
                      <FaBook className="me-3 text-success" />
                      <Link
                        className="wd-assignment-link fs-5"
                        to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                      >
                        {quiz.title}
                      </Link>
                    </div>
                    <div>
                      <span className="text-success me-2">✓</span>
                      <IoEllipsisVertical className="fs-4" />
                    </div>
                  </div>
                  <div className="text-muted ms-5">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong>{" "}
                    {quiz.availableDate} |<br />
                    <strong>Due:</strong> {quiz.dueDate} at 11:59pm |{" "}
                    <strong>Points:</strong> {quiz.points} pts
                  </div>
                </li>
              ))
            ) : (
              <li>No assignments available for this course</li>
            )}
          </ul>

          {/* <ul className="wd-assignment list-group rounded-0">
            {quizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="list-group-item p-4"
                style={{
                  paddingLeft: "20px",
                  border: "1px solid #ddd",
                  borderLeft: "4px solid green",
                  marginBottom: "0",
                  borderTop: "none",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-3 fs-3" />
                    <FaBook className="me-3 text-success" />
                    <Link
                      className="wd-assignment-link fs-5"
                      to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                    >
                      {quiz.title}
                    </Link>
                  </div>
                  <div>
                    <span className="text-success me-2">✓</span>
                    <IoEllipsisVertical className="fs-4" />
                  </div>
                </div>
                <div className="text-muted ms-5">
                  {quiz.status} | Due {quiz.dueDate} | {quiz.points} pts |{" "}
                  {quiz.questions} Questions
                </div>
              </li>
            ))}
          </ul> */}
        </li>
      </ul>
    </div>
  );
}