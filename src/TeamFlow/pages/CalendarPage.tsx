import { useRef, useState } from "react";
import { CALENDAR, CALENDAR_DAYS, EVENTS, MEMBERS, TASKS, type CalendarEvent } from "../data";
import type { CreationMode } from "../App";

function Avatar({ initials, color, size = 22 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ background: color, width: size, height: size, minWidth: size, fontSize: size * 0.4 }}
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

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const SLOT = 64;

function fmtHour(h: number) {
  return h >= 12 ? `${h === 12 ? 12 : h - 12} PM` : `${h} AM`;
}

function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()} style={{ border: "1px solid #EAECF0" }}>
        <div className="h-1.5 rounded-t-2xl" style={{ background: event.projectColor }} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[16px] font-bold text-[#111827]">{event.title}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ background: event.projectColor }} />
                <span className="text-[12px]" style={{ color: "#6B7280" }}>{event.project}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-[#9CA3AF] hover:bg-[#F5F6FA] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[13px]" style={{ color: "#374151" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#9CA3AF", flexShrink: 0 }}>
                <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 6h12M4.5 1v2M9.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {CALENDAR_DAYS.find((d) => d.day === event.day)?.label} {CALENDAR.monthShort} {event.day} · {event.time} ({event.duration} min)
            </div>
            {event.hasVideo && (
              <div className="flex items-center gap-2.5 text-[13px]" style={{ color: "#374151" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#9CA3AF", flexShrink: 0 }}>
                  <path d="M1 3.5h8a.5.5 0 01.5.5v6a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M9.5 5.5L13 4v6l-3.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                Video meeting
              </div>
            )}
            {event.description && (
              <p className="text-[12.5px] leading-relaxed rounded-xl px-3 py-2.5" style={{ color: "#6B7280", background: "#F5F6FA" }}>
                {event.description}
              </p>
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Attendees</p>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((a) => {
                  const m = MEMBERS[a];
                  return m ? (
                    <div key={a} className="flex items-center gap-1.5">
                      <Avatar initials={m.initials} color={m.color} size={22} />
                      <span className="text-[12px]" style={{ color: "#374151" }}>{m.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 mt-5">
            {event.hasVideo && (
              <button className="flex-1 text-white text-[13px] font-semibold rounded-xl py-2.5 hover:opacity-90 transition-opacity" style={{ background: "#7C5CFC" }}>
                Join meeting
              </button>
            )}
            <button className="flex-1 text-[13px] font-medium rounded-xl py-2.5 transition-colors" style={{ border: "1px solid #EAECF0", color: "#374151" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F6FA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventBlock({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const top = (event.hour - 8) * SLOT;
  const height = Math.max((event.duration / 60) * SLOT, 28);
  return (
    <button
      onClick={onClick}
      className="absolute left-1 right-1 rounded-xl overflow-hidden text-left transition-all"
      style={{
        top,
        height,
        background: event.projectColor + "1A",
        borderLeft: `3px solid ${event.projectColor}`,
        zIndex: 1,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(0.95)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "none"; }}
    >
      <div className="px-2 py-1">
        <p className="text-[10.5px] font-semibold leading-tight truncate" style={{ color: event.projectColor }}>{event.title}</p>
        {height > 36 && <p className="text-[10px] opacity-70" style={{ color: event.projectColor }}>{event.time}</p>}
      </div>
    </button>
  );
}

type View = "Day" | "Week" | "Month";

export default function CalendarPage({ onCreate }: { onCreate: (mode: CreationMode) => void }) {
  const [view, setView] = useState<View>("Week");
  const [sel, setSel] = useState<CalendarEvent | null>(null);
  const [upcomingWidth, setUpcomingWidth] = useState(272);
  const resizeStart = useRef<{ x: number; width: number } | null>(null);

  const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resizeStart.current = { x: event.clientX, width: upcomingWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const resize = (moveEvent: PointerEvent) => {
      if (!resizeStart.current) return;
      // The right panel is anchored to the right, so moving left makes it wider.
      const next = resizeStart.current.width + resizeStart.current.x - moveEvent.clientX;
      setUpcomingWidth(Math.max(220, Math.min(480, next)));
    };
    const stopResize = () => {
      resizeStart.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResize);
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopResize);
  };

  return (
    <div className="flex h-full" style={{ background: "#F5F6FA" }}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-7 py-5 bg-white border-b flex-shrink-0" style={{ borderColor: "#EAECF0" }}>
          <h1 className="text-[22px] font-bold text-[#111827] tracking-tight mr-2">Calendar</h1>
          <button onClick={() => onCreate("event")} className="flex items-center gap-1.5 text-white text-[12.5px] font-semibold rounded-xl px-3.5 py-2 hover:opacity-90 transition-opacity" style={{ background: "#7C5CFC" }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
            Create event
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 rounded-xl text-[#6B7280] transition-colors" onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F6FA")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="text-[13.5px] font-semibold text-[#111827] min-w-[130px] text-center">{CALENDAR.label}</span>
            <button className="p-2 rounded-xl text-[#6B7280] transition-colors" onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F6FA")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="text-[12px] font-medium border rounded-xl px-3 py-1.5 transition-colors" style={{ borderColor: "#EAECF0", color: "#374151" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F6FA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >Today</button>
          </div>
          <div className="flex items-center gap-0.5 bg-white rounded-xl p-1" style={{ border: "1px solid #EAECF0" }}>
            {(["Day", "Week", "Month"] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="text-[12px] font-medium rounded-lg px-3 py-1.5 transition-all"
                style={{ background: view === v ? "#7C5CFC" : "transparent", color: view === v ? "#FFFFFF" : "#6B7280" }}
              >{v}</button>
            ))}
          </div>
        </div>

        {/* Week grid */}
        <div className="flex-1 overflow-auto scrollbar-thin bg-white">
          <div className="flex" style={{ minWidth: 580 }}>
            {/* Time col */}
            <div className="flex-shrink-0 w-16 border-r" style={{ borderColor: "#F3F4F6" }}>
              <div className="h-[60px] border-b" style={{ borderColor: "#F3F4F6" }} />
              {HOURS.map((h) => (
                <div key={h} className="border-b flex items-start justify-end pr-3 pt-1.5" style={{ height: SLOT, borderColor: "#F3F4F6" }}>
                  <span className="text-[10.5px] font-medium" style={{ color: "#9CA3AF" }}>{fmtHour(h)}</span>
                </div>
              ))}
            </div>
            {/* Day cols */}
            {CALENDAR_DAYS.map(({ day, label }) => {
              const isToday = day === new Date().getDate();
              const dayEvents = EVENTS.filter((e) => e.day === day);
              const dueTasks = TASKS.filter((task) => task.dueAt && new Date(task.dueAt).getDate() === day && task.status !== "done");
              return (
                <div key={day} className="flex-1 border-r last:border-0" style={{ borderColor: "#F3F4F6" }}>
                  <div className="h-[60px] border-b flex flex-col items-center justify-center bg-white sticky top-0 z-10" style={{ borderColor: "#F3F4F6" }}>
                    <span className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: isToday ? "#7C5CFC" : "#9CA3AF" }}>{label}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ background: isToday ? "#7C5CFC" : "transparent" }}>
                      <span className="text-[16px] font-bold" style={{ color: isToday ? "#FFF" : "#374151" }}>{day}</span>
                    </div>
                    {dueTasks.length > 0 && <span title={dueTasks.map((task) => task.title).join(" · ")} className="-mt-0.5 max-w-[88%] truncate text-[9px] font-semibold" style={{ color: dueTasks[0].projectColor }}>⌁ {dueTasks.length} due</span>}
                  </div>
                  <div className="relative" style={{ height: HOURS.length * SLOT }}>
                    {HOURS.map((h) => (
                      <div key={h} className="border-b hover:bg-[#F9FAFB] transition-colors cursor-pointer" style={{ height: SLOT, borderColor: "#F3F4F6" }} />
                    ))}
                    {isToday && (
                      <div className="absolute left-0 right-0 flex items-center z-20 pointer-events-none" style={{ top: (9.25 - 8) * SLOT }}>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#7C5CFC" }} />
                        <div className="flex-1 h-[1.5px]" style={{ background: "#7C5CFC" }} />
                      </div>
                    )}
                    {dayEvents.map((ev) => <EventBlock key={ev.id} event={ev} onClick={() => setSel(ev)} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drag this divider to allocate more space to the calendar or Upcoming panel. */}
      <button
        type="button"
        aria-label="Resize Upcoming panel"
        title="Drag to resize Upcoming"
        onPointerDown={startResize}
        className="relative hidden w-2 flex-shrink-0 cursor-col-resize touch-none lg:block group"
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#EAECF0] group-hover:bg-[#7C5CFC]" />
        <span className="absolute left-1/2 top-1/2 h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9D2FF] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      {/* Right panel */}
      <div className="flex-shrink-0 border-l overflow-y-auto scrollbar-thin hidden lg:block" style={{ width: upcomingWidth, borderColor: "#EAECF0", background: "#F5F6FA" }}>
        <div className="p-5 space-y-5">
          <SectionCard
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M1 6h12M4.5 1v2M9.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
            title="Upcoming"
          >
            {EVENTS.slice().sort((a, b) => a.day - b.day || a.hour - b.hour).map((ev) => {
              const d = CALENDAR_DAYS.find((d) => d.day === ev.day);
              return (
                <button key={ev.id} onClick={() => setSel(ev)}
                  className="w-full flex items-start gap-2.5 px-4 py-3 text-left transition-colors group border-b last:border-0"
                  style={{ borderColor: "#F3F4F6" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: ev.projectColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-[#111827] truncate group-hover:text-[#7C5CFC] transition-colors">{ev.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{d?.label} · {ev.time}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {ev.attendees.slice(0, 3).map((a) => {
                        const m = MEMBERS[a];
                        return m ? <Avatar key={a} initials={m.initials} color={m.color} size={18} /> : null;
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </SectionCard>

        </div>
      </div>

      {sel && <EventModal event={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
