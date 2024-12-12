import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import FacultyOnly from "./Account/FacultyOnly";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
  enrolling,
  setEnrolling,
  updateEnrollment,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const { enrollments, showAllCourses, loading, error } = useSelector(
    (state: any) =>
      state.enrollmentsReducer || {
        enrollments: [],
        showAllCourses: false,
        loading: false,
        error: null,
      }
  );

  const [localLoading, setLocalLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const dispatch = useDispatch();

  // Filter courses based on enrollment status and showAllCourses flag
  const displayedCourses =
    currentUser.role === "STUDENT" && !showAllCourses
      ? courses.filter((course) =>
          enrollments.some(
            (enrollment: any) =>
              enrollment.user === currentUser._id &&
              enrollment.course === course._id
          )
        )
      : courses;

  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 id="wd-dashboard-title">
            Dashboard
            <button
              onClick={() => setEnrolling(!enrolling)}
              className="float-end btn btn-primary"
            >
              {enrolling ? "My Courses" : "All Courses"}
            </button>
          </h1>
        </div>
      </div>

      <hr />

      <FacultyOnly>
        <h5>
          New Course
          <button
            className="btn btn-primary float-end"
            id="wd-add-new-course-click"
            onClick={addNewCourse}
          >
            Add
          </button>
          <button
            className="btn btn-warning float-end me-2"
            onClick={updateCourse}
          >
            Update
          </button>
        </h5>
        <br />
        <input
          value={course.name}
          className="form-control mb-2"
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
        />
        <textarea
          value={course.description}
          className="form-control"
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value })
          }
        />
        <hr />
      </FacultyOnly>

      <h2 id="wd-dashboard-published">
        {currentUser.role === "STUDENT"
          ? showAllCourses
            ? "Available Courses"
            : "My Courses"
          : "Published Courses"}{" "}
        ({displayedCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {displayedCourses.map((course) => (
            <div
              className="wd-dashboard-course col"
              style={{ width: "300px" }}
              key={course._id}
            >
              <div className="card rounded-3 overflow-hidden">
                <Link
                  to={
                    currentUser?.role === "FACULTY" || isEnrolled(course._id)
                      ? `/Kanbas/Courses/${course._id}/Home`
                      : "#"
                  }
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={(e) => {
                    if (
                      !(
                        currentUser?.role === "FACULTY" ||
                        isEnrolled(course._id)
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <img
                    src="/images/reactjs.jpg"
                    width="100%"
                    height={160}
                    alt={course.name}
                  />
                  <div className="card-body">
                    <h5 className="wd-dashboard-course-title card-title">
                      {enrolling && (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            updateEnrollment(course._id, !course.enrolled);
                          }}
                          className={`btn ${
                            course.enrolled ? "btn-danger" : "btn-success"
                          } float-end`}
                        >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}

                      {course.name}
                    </h5>
                    <p
                      className="wd-dashboard-course-title card-text overflow-y-hidden"
                      style={{ maxHeight: 100 }}
                    >
                      {course.description}
                    </p>

                    {currentUser?.role === "FACULTY" && (
                      <div className="btn-group w-100">
                        <Link
                          to={`/Kanbas/Courses/${course._id}/Home`}
                          className="btn btn-primary"
                        >
                          Go
                        </Link>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.stopPropagation();
                            setCourse(course);
                          }}
                          className="btn btn-warning"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
