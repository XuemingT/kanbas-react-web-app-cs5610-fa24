import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";

// Define types inline since there might be import issues
interface Assignment {
  _id?: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  untilDate: string;
  course: string;
}

interface AssignmentsState {
  assignmentsReducer: {
    assignments: Assignment[];
  };
}

export default function AssignmentEditor() {
  const { cid = "", aid } = useParams<Record<string, string>>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assignment = useSelector((state: AssignmentsState) =>
    aid
      ? state.assignmentsReducer.assignments.find(
          (a: Assignment) => a._id === aid
        )
      : null
  );

  const initialFormData: Assignment = {
    title: "",
    description: "",
    points: 100,
    dueDate: new Date().toISOString().split("T")[0],
    availableFrom: new Date().toISOString().split("T")[0],
    untilDate: new Date().toISOString().split("T")[0],
    course: cid,
  };

  const [formData, setFormData] = useState<Assignment>(
    assignment || initialFormData
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev: Assignment) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (aid) {
      dispatch(updateAssignment({ ...formData, _id: aid }));
    } else {
      dispatch(addAssignment(formData));
    }
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <h2 className="mb-4">{aid ? "Edit Assignment" : "New Assignment"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Assignment Name */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-bold">
            Assignment Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
            required
            placeholder="Enter assignment name"
          />
        </div>

        {/* Assignment Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold">
            Assignment Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
            rows={5}
            placeholder="Enter assignment description"
          />
        </div>

        {/* Points */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="points" className="form-label fw-bold">
              Points
            </label>
          </div>
          <div className="col-md-9">
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              className="form-control"
              required
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Due Dates Section */}
        <div className="border p-3 mb-4">
          <h3 className="h5 mb-4">Due Dates</h3>

          {/* Due Date */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="dueDate" className="form-label fw-bold">
                Due Date
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Available From */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="availableFrom" className="form-label fw-bold">
                Available From
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="date"
                id="availableFrom"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Until Date */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="untilDate" className="form-label fw-bold">
                Until
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="date"
                id="untilDate"
                name="untilDate"
                value={formData.untilDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Link
            to={`/Kanbas/Courses/${cid}/Assignments`}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button type="submit" className="btn btn-danger">
            {aid ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
