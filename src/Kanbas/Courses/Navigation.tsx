import { Link, useParams, useLocation } from "react-router-dom";

export default function CoursesNavigation() {
  const { cid } = useParams<{ cid: string }>();

  const location = useLocation();

  const links = [
    { label: "Overview", route: "Home" },
    { label: "Workstreams", route: "Modules" },
    { label: "Tasks", route: "Assignments" },
    { label: "Team", route: "People" },
  ];

  return (
    <div
      className="wd list-group rounded-0 d-none d-md-block"
      id="wd-courses-navigation"
    >
      {links.map(({ label, route }) => (
        <Link
          key={route}
          className={`list-group-item border-0 ${
            location.pathname.includes(route) ? "active" : "text-danger"
          }`}
          to={`/Kanbas/Courses/${cid}/${route}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
