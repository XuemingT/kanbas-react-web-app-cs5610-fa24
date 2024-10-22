import { Link, useParams, useLocation } from "react-router-dom";

export default function CoursesNavigation() {
  const { cid } = useParams<{ cid: string }>();

  const location = useLocation();

  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];

  return (
    <div
      className="wd list-group rounded-0 d-none d-md-block"
      id="wd-courses-navigation"
    >
      {links.map((link) => (
        <Link
          key={link}
          className={`list-group-item border-0 ${
            location.pathname.includes(link) ? "active" : "text-danger"
          }`}
          to={`/Kanbas/Courses/${cid}/${link}`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
