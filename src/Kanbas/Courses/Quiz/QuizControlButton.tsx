import React from "react";
import { FaPlus } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizControlButton() {
  const navigate = useNavigate();
  const { cid } = useParams();

  const handleAddQuiz = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/QuizDetails`);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="input-group" style={{ width: "300px" }}>
        <span className="input-group-text">
          <HiMagnifyingGlass />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search for Quiz"
        />
      </div>

      <div id="wd-assignments-controls" className="text-nowrap">
        <button className="btn btn-lg me-2">
          <IoEllipsisVertical className="fs-4" />
        </button>

        <button
          id="wd-add-quiz-btn"
          className="btn btn-lg btn-danger"
          onClick={handleAddQuiz}
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Quiz
        </button>
      </div>
    </div>
  );
}
