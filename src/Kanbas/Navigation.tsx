import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaFolderOpenSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
export default function KanbasNavigation() {
  const { pathname } = useLocation();
  const links = [
    { label: "Home", path: "/Kanbas/Dashboard", icon: AiOutlineDashboard },
    { label: "Projects", path: "/Kanbas/Projects", icon: LiaFolderOpenSolid },
    { label: "Calendar", path: "/Kanbas/Calendar", icon: IoCalendarOutline },
    { label: "Updates", path: "/Kanbas/Inbox", icon: FaInbox },
  ];
  return (
    <div
      id="wd-kanbas-navigation"
      style={{ width: 228 }}
      className="tf-figma-sidebar list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block z-2"
    >
      <Link to="/Kanbas/Dashboard" className="list-group-item border-0 tf-side-brand"><span>TF</span><div><b>TeamFlow</b><small>Workspace Platform</small></div></Link>
      <Link
        to="/Kanbas/Account"
        className={`list-group-item border-0
            ${
              pathname.includes("Account")
                ? "tf-active"
                : ""
            }`}
      >
        <FaRegCircleUser
          className="fs-5"
        />
        <br />
          Profile
      </Link>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`list-group-item bg-black text-center border-0
              ${
              pathname === link.path ? "tf-active" : ""
              }`}
        >
          {link.icon({ className: "fs-5" })}
          {link.label}
        </Link>
      ))}
    </div>
  );
}
