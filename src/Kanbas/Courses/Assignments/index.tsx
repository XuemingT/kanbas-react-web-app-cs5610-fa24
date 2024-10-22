import React from "react";
import { useParams, Link } from "react-router-dom";
import AssignmentCheck from "./AssignmentCheck";
import AssignmentSearchBar from "./seachBar";
import { BsGripVertical } from "react-icons/bs"; // Icon for drag handle
import { FaPlus, FaBook } from "react-icons/fa"; // Book icon
import * as db from "../../Database"; // Import the assignments data

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>(); // Get the course ID from the URL
  const assignments = db.assignments.filter(
    (assignment) => assignment.course === cid
  ); // Filter assignments for the current course

  return (
    <div id="wd-assignments" className="px-4">
      {" "}
      {/* Added padding to the container */}
      <AssignmentSearchBar />
      <button className="btn btn-lg btn-danger float-end">
        <FaPlus className="me-2" />
        Add Assignment
      </button>
      <br />
      <br />
      <br />
      <ul id="wd-assignments-titles" className="list-group rounded-0">
        <li className="wd-assignments-title list-group-item p-0 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-3 fs-3" />{" "}
              {/* Increased margin-right for more space */}
              ASSIGNMENTS
            </div>
            <span className="float-end badge rounded-pill text-bg-primary">
              40% of Total
            </span>
          </div>

          <ul className="wd-assignment list-group rounded-0">
            {/* Dynamically render the assignments for the current course */}
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <li
                  key={assignment._id}
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
                    {/* Adjusted for better layout */}
                    <div className="d-flex align-items-center">
                      <BsGripVertical className="me-3 fs-3" /> {/* Drag icon */}
                      <FaBook className="me-3 text-success" />{" "}
                      {/* Green Book icon */}
                      <Link
                        className="wd-assignment-link fs-5"
                        to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                      >
                        {assignment.title}
                      </Link>
                    </div>
                    <AssignmentCheck />
                  </div>
                  <div className="text-muted ms-5">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong>{" "}
                    {assignment.availableFrom} |<br />
                    <strong>Due:</strong> {assignment.dueDate} at 11:59pm |{" "}
                    <strong>Points:</strong> {assignment.points} pts
                  </div>
                </li>
              ))
            ) : (
              <li>No assignments available for this course</li>
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
}
