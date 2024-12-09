import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const active = (path: string) => (pathname.includes(path) ? "active" : "");
  const { pathname } = useLocation();

  return (
    <div id="wd-account-navigation" className="list-group">
      {links.map((link) => (
        <Link
          key={link}
          to={`/Kanbas/Account/${link}`}
          className={`list-group-item ${active(link)}`}
        >
          {" "}
          {link}{" "}
        </Link>
      ))}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link
          to={`/Kanbas/Account/Users`}
          className={`list-group-item ${active("Users")}`}
        >
          {" "}
          Users{" "}
        </Link>
      )}

      {/*
          <Link to="/Kanbas/Account/Signin">Signin</Link>
          <br />
          <Link to="/Kanbas/Account/Signup">Signup</Link>
          <br />
          <Link to="/Kanbas/Account/Profile">Profile</Link><br /> */}
    </div>
  );
}
