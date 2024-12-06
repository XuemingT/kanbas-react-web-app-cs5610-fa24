import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import AssignmentCheck from "./AssignmentCheck";
import AssignmentSearchBar from "./seachBar";
import { BsGripVertical } from "react-icons/bs";
import { FaBook, FaTrash } from "react-icons/fa";
import FacultyOnly from "../../Account/FacultyOnly";
import AssignmentsControlButton from "./AssignmentsControlButton";
import {
  deleteAssignment,
  setAssignments,
  setLoading,
  setError,
} from "./reducer";
import * as client from "./client";
import { Assignment } from "./types";

interface AssignmentsState {
  assignmentsReducer: {
    assignments: Assignment[];
    loading: boolean;
    error: string | null;
  };
}

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const { assignments, loading, error } = useSelector(
    (state: AssignmentsState) => state.assignmentsReducer
  );

  const courseAssignments = assignments.filter(
    (assignment) => assignment.course === cid
  );

  useEffect(() => {
    const fetchAssignments = async () => {
      dispatch(setLoading());
      try {
        const data = await client.findAssignmentsForCourse(cid as string);
        dispatch(setAssignments(data));
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "An error occurred")
        );
      }
    };

    if (cid) {
      fetchAssignments();
    }
  }, [cid, dispatch]);

  const handleDelete = async (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (assignmentToDelete) {
      dispatch(setLoading());
      try {
        await client.deleteAssignment(assignmentToDelete);
        dispatch(deleteAssignment(assignmentToDelete));
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "An error occurred")
        );
      }
      setAssignmentToDelete(null);
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading assignments...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">Error: {error}</div>;
  }

  return (
    <div id="wd-assignments" className="px-4">
      <AssignmentSearchBar />
      <FacultyOnly>
        <AssignmentsControlButton />
      </FacultyOnly>
      <br />
      <br />
      <br />
      <ul id="wd-assignments-titles" className="list-group rounded-0">
        <li className="wd-assignments-title list-group-item p-0 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-3 fs-3" />
              ASSIGNMENTS
            </div>
            <span className="float-end badge rounded-pill text-bg-primary">
              40% of Total
            </span>
          </div>

          <ul className="wd-assignment list-group rounded-0">
            {assignments.map((assignment) => (
              <li
                key={assignment._id}
                className="wd-assignment list-group-item p-4"
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
                      to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                    >
                      {assignment.title}
                    </Link>
                  </div>
                  <div>
                    <AssignmentCheck />
                    <FacultyOnly>
                      <FaTrash
                        className="text-danger ms-2"
                        onClick={() => handleDelete(assignment._id || "")}
                        style={{ cursor: "pointer" }}
                      />
                    </FacultyOnly>
                  </div>
                </div>
                <div className="text-muted ms-5">
                  <span className="text-danger">Multiple Modules</span> |
                  <strong>Not available until</strong>{" "}
                  {assignment.availableFrom} |
                  <br />
                  <strong>Due:</strong> {assignment.dueDate} at 11:59pm |
                  <strong>Points:</strong> {assignment.points} pts
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      {/* Bootstrap Modal for Delete Confirmation */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Assignment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this assignment? This action
                cannot be undone.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
