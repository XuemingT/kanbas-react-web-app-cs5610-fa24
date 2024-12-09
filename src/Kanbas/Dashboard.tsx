import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  toggleShowAllCourses,
  enrollInCourse,
  unenrollFromCourse,
  setEnrollments,
  setLoading,
  setError,
} from "./Courses/Enrollments/reducer";
import * as enrollmentClient from "./Courses/Enrollments/client";
import StudentOnly from "./Account/StudentOnly";
import FacultyOnly from "./Account/FacultyOnly";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
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

  useEffect(() => {
    const fetchEnrollments = async () => {
      dispatch(setLoading());
      try {
        const data = await enrollmentClient.findEnrollmentsByUser(
          currentUser._id
        );
        dispatch(setEnrollments(data));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error ? err.message : "Failed to fetch enrollments"
          )
        );
      }
    };

    fetchEnrollments();
  }, [dispatch, currentUser._id]);

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

  const handleEnrollmentToggle = async (
    courseId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setLocalLoading((prev) => ({ ...prev, [courseId]: true }));

    try {
      if (isEnrolled(courseId)) {
        await enrollmentClient.unenrollFromCourse(currentUser._id, courseId);
        dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
      } else {
        const newEnrollment = await enrollmentClient.enrollInCourse(
          currentUser._id,
          courseId
        );
        dispatch(enrollInCourse(newEnrollment));
      }
    } catch (err) {
      dispatch(
        setError(
          err instanceof Error ? err.message : "Failed to update enrollment"
        )
      );
    } finally {
      setLocalLoading((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 id="wd-dashboard-title">Dashboard</h1>
        </div>
        {currentUser.role === "STUDENT" && (
          <div className="ms-auto">
            <StudentOnly>
              {loading ? (
                <button className="btn btn-primary" disabled>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Loading...
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => dispatch(toggleShowAllCourses())}
                >
                  {showAllCourses ? "Show My Courses" : "Enrollments"}
                </button>
              )}
            </StudentOnly>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn-close float-end"
            onClick={() => dispatch(setError(null))}
          />
        </div>
      )}

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
                      {course.name}
                    </h5>
                    <p
                      className="wd-dashboard-course-title card-text overflow-y-hidden"
                      style={{ maxHeight: 100 }}
                    >
                      {course.description}
                    </p>

                    {currentUser?.role === "FACULTY" ? (
                      <>
                        <button className="btn btn-primary">Go</button>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        {isEnrolled(course._id) && (
                          <button className="btn btn-primary">Go</button>
                        )}
                        <button
                          className={`btn ${
                            isEnrolled(course._id)
                              ? "btn-danger"
                              : "btn-success"
                          } float-end`}
                          onClick={(e) => handleEnrollmentToggle(course._id, e)}
                          disabled={localLoading[course._id]}
                        >
                          {localLoading[course._id] ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              {isEnrolled(course._id)
                                ? "Unenrolling..."
                                : "Enrolling..."}
                            </>
                          ) : isEnrolled(course._id) ? (
                            "Unenroll"
                          ) : (
                            "Enroll"
                          )}
                        </button>
                      </>
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
