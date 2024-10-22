import React from "react";
import { useParams, Link } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const assignment = db.assignments.find(
    (assignment) => assignment._id === aid
  );
  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-4">
      <h3 className="mb-3">{assignment.title}</h3>

      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input
          id="wd-name"
          value={assignment.title}
          className="form-control"
          readOnly
        />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Assignment Description
        </label>
        <textarea
          id="wd-description"
          cols={45}
          rows={5}
          className="form-control"
          defaultValue={assignment.description}
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-points" className="form-label">
            Points
          </label>
        </div>
        <div className="col-md-9">
          <input
            id="wd-points"
            value={assignment.points}
            className="form-control"
            readOnly
          />
        </div>
      </div>

      {/* Assignment Group */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-group" className="form-label">
            Assignment Group
          </label>
        </div>
        <div className="col-md-9">
          <select id="wd-select-group" className="form-select">
            <option selected value="ASSIGNMENTS">
              ASSIGNMENTS
            </option>
            <option value="TESTS">TESTS</option>
            <option value="PROJECTS">PROJECTS</option>
            <option value="LABS">LABS</option>
          </select>
        </div>
      </div>

      {/* Display Grade */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-grade-display" className="form-label">
            Display Grade as
          </label>
        </div>
        <div className="col-md-9">
          <select id="wd-select-grade" className="form-select">
            <option selected value="PERCENTAGE">
              Percentage
            </option>
            <option value="LETTER">Letter</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-submission-type" className="form-label">
            Submission Type
          </label>
        </div>
        <div className="col-md-9 border p-3">
          <select id="wd-select-submission" className="form-select">
            <option selected value="Online">
              ONLINE
            </option>
            <option value="INPERSON">IN-PERSON</option>
          </select>

          <div className="mt-3">
            <label className="form-label fw-bold">Online Entry Options</label>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wd-text-entry"
              />
              <label htmlFor="wd-text-entry" className="form-check-label">
                Text Entry
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wd-website-url"
                defaultChecked={true}
              />
              <label htmlFor="wd-website-url" className="form-check-label">
                Website URL
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wd-media-recording"
              />
              <label htmlFor="wd-media-recording" className="form-check-label">
                Media Recordings
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wd-student-annotation"
              />
              <label
                htmlFor="wd-student-annotation"
                className="form-check-label"
              >
                Student Annotation
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wd-file-uploads"
              />
              <label htmlFor="wd-file-uploads" className="form-check-label">
                File Uploads
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="wd-submission-type" className="form-label">
            Assign
          </label>
        </div>
        {/* Assign section in a grid box */}
        <div className="border p-3 col-md-9">
          <div className="row mb-3 ">
            <div className="col-md-3">
              <label htmlFor="wd-assign" className="form-label fw-bold">
                Assign to
              </label>
            </div>
            <div className="col-md-9">
              <input
                id="wd-assign"
                value="Everyone"
                className="form-control"
                readOnly
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="wd-due" className="form-label fw-bold">
                Due
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="date"
                id="wd-due"
                value={assignment.dueDate}
                className="form-control"
                readOnly
              />
            </div>
          </div>

          {/* Available From and Until */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="wd-available" className="form-label fw-bold">
                Available from
              </label>
            </div>
            <div className="col-md-4">
              <input
                type="date"
                id="wd-available"
                value={assignment.availableFrom}
                className="form-control"
              />
            </div>
            <div className="col-md-1 text-center fw-bold">Until</div>
            <div className="col-md-4">
              <input
                type="date"
                id="wd-until"
                value={assignment.untilDate}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="d-flex justify-content-end">
        <Link
          to={`/Kanbas/Courses/${cid}/Assignments`}
          className="btn btn-secondary me-2"
        >
          Cancel
        </Link>
        <Link
          to={`/Kanbas/Courses/${cid}/Assignments`}
          className="btn btn-danger"
        >
          Save
        </Link>
      </div>
    </div>
  );
}
