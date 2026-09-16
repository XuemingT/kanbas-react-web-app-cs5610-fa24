import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { signout } from "../teamflowClient";

export default function Profile() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initials = `${currentUser?.firstName?.[0] || ""}${currentUser?.lastName?.[0] || ""}`.toUpperCase() || "TF";
  const name = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || "Workspace member";
  const leaveWorkspace = async () => {
    await signout();
    dispatch(setCurrentUser(null));
    navigate("/Kanbas/Account/Signin");
  };
  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F5F6FA" }}>
      <section className="w-full max-w-lg bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAECF0", boxShadow: "0 12px 30px rgba(17,24,39,.08)" }}>
        <div className="p-6" style={{ background: "#1A1D2E" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold mb-4" style={{ background: "#7C5CFC" }}>{initials}</div>
          <p className="text-white text-[20px] font-bold">{name}</p>
          <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>{currentUser?.role || "Member"} · TeamFlow workspace</p>
        </div>
        <div className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>Account</p>
          <dl className="space-y-3 text-[13px]">
            <div className="flex justify-between gap-6"><dt style={{ color: "#6B7280" }}>Username</dt><dd className="font-medium text-[#111827]">{currentUser?.username}</dd></div>
            <div className="flex justify-between gap-6"><dt style={{ color: "#6B7280" }}>Email</dt><dd className="font-medium text-[#111827]">{currentUser?.email}</dd></div>
          </dl>
          <div className="flex gap-3 mt-7">
            <button onClick={() => navigate("/Kanbas/Dashboard")} className="flex-1 rounded-xl py-2.5 text-white text-[13px] font-semibold" style={{ background: "#7C5CFC" }}>Back to workspace</button>
            <button onClick={leaveWorkspace} className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold" style={{ border: "1px solid #EAECF0", color: "#374151" }}>Sign out</button>
          </div>
        </div>
      </section>
    </main>
  );
}
