import React from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignmentsControlButton() {
  const navigate = useNavigate();
  const { cid } = useParams();

  const handleAddAssignment = () => {
    navigate(`/Kanbas/Courses/${cid}/Assignments/new`);
  };

  return (
    <div id="wd-assignments-controls" className="text-nowrap">
      <button
        id="wd-add-assignments-btn"
        className="btn btn-lg btn-danger me-1 float-end"
        onClick={handleAddAssignment}
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </button>

      <button
        id="wd-add-group-btn"
        className="btn btn-lg btn-secondary me-1 float-end"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </button>
    </div>
  );
}
