import { CiSearch } from "react-icons/ci";

export default function AssignmentSearchBar() {
  return (
    <div id="wd-assignments-search-container" className="position-relative">
      <CiSearch
        className="position-absolute"
        style={{
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "1.2rem",
          color: "#6c757d",
        }}
      />
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        style={{ paddingLeft: "35px", width: "250px" }}
      />
    </div>
  );
}
