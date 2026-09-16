import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "./Profile";
import Signin from "./Signin";

export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return (
    <Routes>
      <Route index element={<Navigate to={currentUser ? "Profile" : "Signin"} replace />} />
      <Route path="Signin" element={<Signin />} />
      <Route path="Signup" element={<Navigate to="../Signin" replace />} />
      <Route path="Profile" element={<Profile />} />
    </Routes>
  );
}
