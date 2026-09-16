import { useEffect, useState } from "react";
import { getSession, updateProfile } from "../Kanbas/teamflowClient";

type Account = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function AccountSettings({
  onClose,
  onSaved,
  onSignOut,
}: {
  onClose: () => void;
  onSaved: () => Promise<void>;
  onSignOut: () => Promise<void>;
}) {
  const [account, setAccount] = useState<Account | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState<"profile" | "password" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getSession()
      .then((user) => {
        setAccount(user);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
      })
      .catch(() => setError("Could not load account settings."));
  }, []);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving("profile"); setError(""); setNotice("");
      const user = await updateProfile({ firstName, lastName, email });
      setAccount(user);
      await onSaved();
      setNotice("Profile updated.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not update your profile.");
    } finally { setSaving(null); }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    try {
      setSaving("password"); setError(""); setNotice("");
      await updateProfile({ currentPassword, newPassword });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setNotice("Password changed successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not change your password.");
    } finally { setSaving(null); }
  };

  const field = "mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#374151] outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/10";
  const label = "block text-[12px] font-semibold text-[#374151]";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-[#111827]/40" />
      <section onMouseDown={(event) => event.stopPropagation()} className="relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl border border-[#EAECF0] bg-[#F8F9FB] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#EAECF0] bg-white px-6 py-4">
          <div><h2 className="text-[18px] font-bold text-[#111827]">Account settings</h2><p className="mt-0.5 text-[12px] text-[#9CA3AF]">Manage your TeamFlow profile and sign-in details.</p></div>
          <button aria-label="Close account settings" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-[#9CA3AF] hover:bg-[#F5F6FA] hover:text-[#374151]">×</button>
        </header>

        {!account ? <p className="p-6 text-[13px] text-[#6B7280]">Loading your account…</p> : <div className="space-y-5 p-6">
          {error && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-[12px] text-red-700">{error}</p>}
          {notice && <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-700">{notice}</p>}

          <form onSubmit={saveProfile} className="rounded-2xl border border-[#EAECF0] bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC] text-[12px] font-bold text-white">{`${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "TF"}</div>
              <div><h3 className="text-[14px] font-semibold text-[#111827]">Profile</h3><p className="text-[11.5px] text-[#9CA3AF]">This information appears to your teammates.</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={label}>First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className={field} /></label>
              <label className={label}>Last name<input required value={lastName} onChange={(event) => setLastName(event.target.value)} className={field} /></label>
            </div>
            <label className={`mt-3 ${label}`}>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={field} /></label>
            <div className="mt-3 grid gap-3 text-[12px] sm:grid-cols-2"><p><span className="block font-semibold text-[#374151]">Username</span><span className="text-[#6B7280]">{account.username}</span></p><p><span className="block font-semibold text-[#374151]">Workspace role</span><span className="text-[#6B7280]">{account.role}</span></p></div>
            <button disabled={saving !== null} className="mt-5 rounded-xl bg-[#7C5CFC] px-4 py-2.5 text-[12.5px] font-semibold text-white hover:bg-[#6847EB] disabled:opacity-60">{saving === "profile" ? "Saving…" : "Save profile"}</button>
          </form>

          <form onSubmit={changePassword} className="rounded-2xl border border-[#EAECF0] bg-white p-5">
            <h3 className="text-[14px] font-semibold text-[#111827]">Change password</h3>
            <p className="mt-0.5 text-[11.5px] text-[#9CA3AF]">Use at least 8 characters.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className={label}>Current password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={field} /></label>
              <label className={label}>New password<input required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={field} /></label>
              <label className={label}>Confirm password<input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={field} /></label>
            </div>
            <button disabled={saving !== null} className="mt-5 rounded-xl border border-[#D9D2FF] bg-[#F7F5FF] px-4 py-2.5 text-[12.5px] font-semibold text-[#6847EB] hover:bg-[#EEE9FF] disabled:opacity-60">{saving === "password" ? "Changing…" : "Change password"}</button>
          </form>

          <div className="flex items-center justify-between rounded-2xl border border-[#F4D7D7] bg-[#FFFBFB] p-4">
            <div><h3 className="text-[13px] font-semibold text-[#374151]">Sign out</h3><p className="mt-0.5 text-[11.5px] text-[#9CA3AF]">End this session on this device.</p></div>
            <button onClick={onSignOut} className="rounded-xl border border-[#F0CACA] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#C24141] hover:bg-red-50">Sign out</button>
          </div>
        </div>}
      </section>
    </div>
  );
}
