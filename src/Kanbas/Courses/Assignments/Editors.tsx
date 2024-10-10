export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-4">
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="wd-name" className="form-label">
              Assignment Name
            </label>
            <input
              id="wd-name"
              value="A1 - ENV + HTML"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-description" className="form-label">
              Assignment Description
            </label>
            <textarea
              id="wd-description"
              cols={45}
              rows={10}
              className="form-control"
            >
              The assignment is available online. Submit a link to the landing
              page of your web application running on Netlify. The landing page
              should include the following: Your full name and your section,
              links to each lab assignment, link to the Kanbas application, and
              links to all relevant source code repositories. The Kanbas
              application should include a link to navigate back to the landing
              page.
            </textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="wd-points" className="form-label">
                Points
              </label>
              <input id="wd-points" value={100} className="form-control" />
            </div>

            <div className="col-md-6">
              <label htmlFor="wd-group" className="form-label">
                Assignment Group
              </label>
              <select id="wd-select-group" className="form-select">
                <option selected value="ASSIGNMENT">
                  ASSIGNMENTS
                </option>
                <option value="TESTS">TESTS</option>
                <option value="PROJECTS">PROJECTS</option>
                <option value="LABS">LABS</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="wd-grade-display" className="form-label">
                Display Grade as
              </label>
              <select id="wd-select-grade" className="form-select">
                <option selected value="PERCENTAGE">
                  Percentage
                </option>
                <option value="LETTER">Letter</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="wd-submission-type" className="form-label">
                Submission Type
              </label>
              <select id="wd-select-submission" className="form-select">
                <option selected value="Online">
                  ONLINE
                </option>
                <option value="INPERSON">IN-PERSON</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Online Entry Options</label>
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

          <div className="mb-3">
            <label className="form-label">Assign to</label>
            <input id="wd-assign" value="Everyone" className="form-control" />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="wd-due" className="form-label">
                Due
              </label>
              <input
                type="date"
                id="wd-due"
                value="2024-05-13"
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="wd-available" className="form-label">
                Available from
              </label>
              <input
                type="date"
                id="wd-available"
                value="2024-05-06"
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="wd-until" className="form-label">
                Until
              </label>
              <input
                type="date"
                id="wd-until"
                value="2024-05-20"
                className="form-control"
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2">Cancel</button>
            <button className="btn btn-danger">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
