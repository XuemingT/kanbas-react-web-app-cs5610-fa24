import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-account-navigation">
      <a href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank">
        Northeastern
      </a>
      <br />

      {/* Show Signin and Signup only if user is NOT logged in */}
      {!currentUser && (
        <>
          <Link to="/Kanbas/Account/Signin">Signin</Link>
          <br />
          <Link to="/Kanbas/Account/Signup">Signup</Link>
          <br />
        </>
      )}

      {/* Show Profile only if user is logged in */}
      {currentUser && (
        <>
          <Link to="/Kanbas/Account/Profile">Profile</Link>
          <br />
        </>
      )}
    </div>
  );
}
