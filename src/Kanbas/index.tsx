import { Navigate, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Session from "./Account/Session";
import ProtectedRoute from "./Account/ProtectedRoute";
import TeamFlowApp from "../TeamFlow/App";

// Account is separate; every signed-in workspace screen uses the Figma export.
export default function Kanbas() {
  return (
    <Session>
      <Routes>
        <Route path="/" element={<Navigate to="Account/Signin" replace />} />
        <Route path="Account/*" element={<Account />} />
        <Route path="*" element={<ProtectedRoute><TeamFlowApp /></ProtectedRoute>} />
      </Routes>
    </Session>
  );
}
