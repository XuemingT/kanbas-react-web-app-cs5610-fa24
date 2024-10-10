import { FaPlus } from "react-icons/fa6";
export default function AssignmentsControlButton() {
  return (
    <div id="wd-assignments-controls" className="text-nowrap">
      <button
        id="wd-add-assignments-btn"
        className="btn btn-lg btn-danger me-1 float-end"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </button>

      <button
        id="wd-add-assignments-btn"
        className="btn btn-lg btn-secondary me-1 float-end"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </button>
    </div>
  );
}
