import { useState } from "react";

type GuidedPage = "projects" | "tasks" | "calendar" | "people" | "chat";

const guides: Record<GuidedPage, { eyebrow: string; title: string; body: string }> = {
  projects: {
    eyebrow: "Projects",
    title: "Keep work organized by project",
    body: "Browse current projects, filter by status, and open any project to see its progress, tasks, collaborators, and recent activity.",
  },
  tasks: {
    eyebrow: "Tasks",
    title: "Your shared to-do list",
    body: "Tasks are saved to the workspace. Check one off to mark it complete, or click it again to reopen it. Overdue work is collected at the top.",
  },
  calendar: {
    eyebrow: "Calendar",
    title: "Plan time with your team",
    body: "Create events and review scheduled meetings here. On desktop, drag the divider beside Upcoming to give the calendar or event list more room.",
  },
  people: {
    eyebrow: "People",
    title: "Find the right teammate",
    body: "This list shows your team. Search the wider workspace when needed, then select Chat to start a direct conversation with a teammate.",
  },
  chat: {
    eyebrow: "Chat",
    title: "Talk in real time",
    body: "Choose a group channel or direct message from the left. New messages are delivered live, and conversations are saved for the team.",
  },
};

export default function PageOnboarding({ userId, page }: { userId: string; page: GuidedPage }) {
  const key = `teamflow-page-tour:${userId}:${page}`;
  const [open, setOpen] = useState(() => !localStorage.getItem(key));
  if (!open) return null;
  const guide = guides[page];
  const dismiss = () => { localStorage.setItem(key, "complete"); setOpen(false); };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#111827]/55 p-5">
      <section className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C5CFC]">{guide.eyebrow} guide</p>
        <h2 className="mt-2 text-[19px] font-bold text-[#111827]">{guide.title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#6B7280]">{guide.body}</p>
        <div className="mt-6 flex justify-between">
          <button onClick={dismiss} className="text-[13px] font-medium text-[#6B7280]">Skip</button>
          <button onClick={dismiss} className="rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#6847EB]">Got it</button>
        </div>
      </section>
    </div>
  );
}
