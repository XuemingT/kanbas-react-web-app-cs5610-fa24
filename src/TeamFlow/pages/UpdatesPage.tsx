import { useState, type ReactElement } from "react";
import { UPDATES, MEMBERS, type Update } from "../data";

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ background: color, width: size, height: size, minWidth: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

function SectionCard({ icon, title, subtitle, children, action }: {
  icon: React.ReactNode; title: string; subtitle?: string;
  children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAECF0" }}>
      <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-[#374151]">{icon}</span>
          <div>
            <p className="text-[14px] font-semibold text-[#111827]">{title}</p>
            {subtitle && <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF" }}>{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

const TYPE_ICON: Record<Update["type"], ReactElement> = {
  status:    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5h8M6 2l3.5 3.5L6 9" stroke="#6366F1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  comment:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 1.5h9v6H6.5L5.5 9 4.5 7.5H1V1.5z" stroke="#10B981" strokeWidth="1.1" strokeLinejoin="round" /></svg>,
  created:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="#7C5CFC" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  date:      <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x=".5" y="1.5" width="10" height="9" rx="1.2" stroke="#F59E0B" strokeWidth="1.1" /><path d="M.5 5h10M3.5 0v2M7.5 0v2" stroke="#F59E0B" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  completed: <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#10B981" strokeWidth="1.1" /><path d="M3 5.5l1.75 1.75L8 3.75" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  mention:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="2" stroke="#EF4444" strokeWidth="1.1" /><circle cx="5.5" cy="5.5" r="4.5" stroke="#EF4444" strokeWidth="1.1" /></svg>,
  assigned:  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="3.5" r="2" stroke="#6B7280" strokeWidth="1.1" /><path d="M1 9.5c0-2.21 2.01-4 4.5-4s4.5 1.79 4.5 4" stroke="#6B7280" strokeWidth="1.1" strokeLinecap="round" /></svg>,
};

const TYPE_BG: Record<Update["type"], string> = {
  status: "#EEF2FF", comment: "#ECFDF5", created: "#EDE9FE",
  date: "#FFFBEB", completed: "#ECFDF5", mention: "#FEF2F2", assigned: "#F3F4F6",
};

function UpdateItem({ update, onMarkRead }: { update: Update; onMarkRead: (id: number) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="flex items-start gap-4 px-5 py-4 relative border-b last:border-0 transition-colors"
      style={{ borderColor: "#F3F4F6", background: hov ? "#FAFAFA" : update.unread ? "#FDFCFF" : "transparent" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {update.unread && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-9 rounded-r-full" style={{ background: "#7C5CFC" }} />
      )}
      <div className="relative flex-shrink-0">
        <Avatar initials={update.initials} color={update.color} size={36} />
        <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white" style={{ background: TYPE_BG[update.type] }}>
          {TYPE_ICON[update.type]}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] text-[#374151] leading-snug">
          <span className="font-semibold text-[#111827]">{update.actor}</span>
          {" "}{update.action}{" "}
          <span className="font-medium text-[#111827] hover:text-[#7C5CFC] cursor-pointer transition-colors">{update.target}</span>
          {update.to && <> → <span className="font-semibold" style={{ color: "#7C5CFC" }}>{update.to}</span></>}
        </p>
        {update.comment && (
          <div className="mt-2 rounded-xl px-3.5 py-2.5" style={{ background: "#F5F6FA", border: "1px solid #EAECF0" }}>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "#4B5563" }}>"{update.comment}"</p>
            <div className="flex items-center gap-3 mt-2">
              <button className="text-[11.5px] font-medium transition-colors" style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7C5CFC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              >Reply</button>
              <button className="text-[11.5px]" style={{ color: "#9CA3AF" }}>👍</button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: update.projectColor }} />
          <span className="text-[11.5px]" style={{ color: "#9CA3AF" }}>
            <span className="hover:text-[#374151] cursor-pointer transition-colors">{update.project}</span>
            {" · "}{update.time}
          </span>
        </div>
      </div>
      {hov && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {update.unread && (
            <button onClick={() => onMarkRead(update.id)}
              className="text-[11px] font-medium rounded-xl px-2.5 py-1 transition-all border"
              style={{ color: "#7C5CFC", borderColor: "#C4B5FD", background: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE9FE")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >Mark read</button>
          )}
        </div>
      )}
    </div>
  );
}

type FilterTab = "All activity" | "Tasks" | "Comments" | "Mentions" | "Project updates";
const FILTER_TABS: FilterTab[] = ["All activity", "Tasks", "Comments", "Mentions", "Project updates"];
const TYPE_MAP: Partial<Record<FilterTab, Update["type"][]>> = {
  Tasks: ["status", "created", "completed", "assigned"],
  Comments: ["comment"],
  Mentions: ["mention"],
  "Project updates": ["status", "date"],
};

export default function UpdatesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All activity");
  const [updates, setUpdates] = useState<Update[]>(UPDATES);

  const filtered = updates.filter((u) => {
    const types = TYPE_MAP[activeTab];
    return types ? types.includes(u.type) : true;
  });

  const unread = updates.filter((u) => u.unread).length;
  const mentions = updates.filter((u) => u.type === "mention").length;
  const needsReview = updates.filter((u) => u.to === "In review").length;

  const todayItems = filtered.filter((u) => u.time.includes("min") || u.time.includes("hr"));
  const olderItems = filtered.filter((u) => u.time.includes("d ago"));

  function markRead(id: number) {
    setUpdates((prev) => prev.map((u) => u.id === id ? { ...u, unread: false } : u));
  }

  function markAllRead() {
    setUpdates((prev) => prev.map((u) => ({ ...u, unread: false })));
  }

  return (
    <div className="flex h-full" style={{ background: "#F5F6FA" }}>
      {/* Feed */}
      <div className="flex-1 min-w-0 overflow-auto scrollbar-thin">
        <div className="px-7 py-7" style={{ maxWidth: 840, margin: "0 auto" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[22px] font-bold text-[#111827] tracking-tight">Updates</h1>
              <p className="text-[13px] mt-0.5" style={{ color: "#9CA3AF" }}>A shared feed of everything your team is moving forward.</p>
            </div>
            {unread > 0 && (
              <button onClick={markAllRead}
                className="text-[12.5px] font-semibold rounded-xl px-4 py-2 transition-colors border"
                style={{ color: "#7C5CFC", borderColor: "#C4B5FD", background: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE9FE")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >Mark all read ({unread})</button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white rounded-2xl p-1 mb-5 overflow-x-auto scrollbar-hide" style={{ border: "1px solid #EAECF0" }}>
            {FILTER_TABS.map((f) => (
              <button key={f} onClick={() => setActiveTab(f)}
                className="text-[12.5px] font-medium rounded-xl px-3.5 py-2 whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                style={{ background: activeTab === f ? "#7C5CFC" : "transparent", color: activeTab === f ? "#FFF" : "#6B7280" }}
              >
                {f}
                {f === "All activity" && unread > 0 && (
                  <span className="text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ background: activeTab === f ? "rgba(255,255,255,0.3)" : "#7C5CFC", color: activeTab === f ? "white" : "white" }}
                  >{unread}</span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl" style={{ border: "1px solid #EAECF0" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#EDE9FE" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a9 9 0 100 18A9 9 0 0012 2zM8 12l3 3 5-5" stroke="#7C5CFC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#111827]">You're all caught up</p>
              <p className="text-[13px] mt-1 max-w-xs" style={{ color: "#9CA3AF" }}>No updates right now. Check back later.</p>
            </div>
          ) : (
            <>
              {todayItems.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>Today</span>
                    <div className="flex-1 h-px" style={{ background: "#EAECF0" }} />
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAECF0" }}>
                    {todayItems.map((u) => <UpdateItem key={u.id} update={u} onMarkRead={markRead} />)}
                  </div>
                </div>
              )}
              {olderItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>Earlier</span>
                    <div className="flex-1 h-px" style={{ background: "#EAECF0" }} />
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #EAECF0" }}>
                    {olderItems.map((u) => <UpdateItem key={u.id} update={u} onMarkRead={markRead} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary panel */}
      <div className="flex-shrink-0 border-l overflow-y-auto scrollbar-thin hidden lg:block p-5 space-y-5" style={{ width: 256, borderColor: "#EAECF0", background: "#F5F6FA" }}>
        {/* Stats */}
        <SectionCard
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9h3l2-6 3 10 2-7 1.5 3H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          title="Summary"
        >
          {[
            { label: "Unread", value: unread, color: unread > 0 ? "#7C5CFC" : "#9CA3AF", bg: unread > 0 ? "#EDE9FE" : "#F5F6FA" },
            { label: "Mentions", value: mentions, color: mentions > 0 ? "#EF4444" : "#9CA3AF", bg: mentions > 0 ? "#FEF2F2" : "#F5F6FA" },
            { label: "Needs review", value: needsReview, color: "#9CA3AF", bg: "#F5F6FA" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: "#F3F4F6" }}>
              <span className="text-[12.5px] font-medium" style={{ color: "#374151" }}>{label}</span>
              <span className="text-[13px] font-bold rounded-lg px-2.5 py-0.5" style={{ color, background: bg }}>{value}</span>
            </div>
          ))}
        </SectionCard>

        {/* Active teammates */}
        <SectionCard
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" /><path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M13 13c0-1.66-.9-3.1-2.2-3.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
          title="Active today"
        >
          {Object.values(MEMBERS).map((m) => (
            <div key={m.initials} className="flex items-center gap-2.5 px-4 py-2.5 border-b last:border-0" style={{ borderColor: "#F3F4F6" }}>
              <div className="relative">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{ background: m.color, fontSize: 10 }}>
                  {m.initials}
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white" style={{ background: "#10B981" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[#374151] truncate">{m.name}</p>
                <p className="text-[10.5px]" style={{ color: "#9CA3AF" }}>{m.initials === "AM" ? "You" : m.role}</p>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
