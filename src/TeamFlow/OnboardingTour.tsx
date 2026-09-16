import { useEffect, useState } from "react";

const steps = [
  ["Quick Actions", "Create tasks, projects, meetings, or teammate invitations from this panel.", "#teamflow-quick-actions"],
  ["Tasks", "Use Tasks to see all work in one place. Check a task to save it as completed.", "#teamflow-nav-tasks"],
  ["Notifications", "Open the bell to review invitations, upcoming meetings, and project updates.", "#teamflow-notifications"],
];

export default function OnboardingTour({ userId }: { userId: string }) {
  const key = `teamflow-tour:${userId}`;
  const [step, setStep] = useState(() => localStorage.getItem(key) ? -1 : 0);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);
  const [cardPosition, setCardPosition] = useState<React.CSSProperties>({ bottom: 32, left: "50%", transform: "translateX(-50%)" });
  useEffect(() => {
    if (step < 0) return;
    const updateSpotlight = () => {
      const rect = document.querySelector(steps[step][2])?.getBoundingClientRect() || null;
      setSpotlight(rect);
      if (!rect || window.innerWidth < 720) return setCardPosition({ bottom: 20, left: "50%", transform: "translateX(-50%)" });
      const width = 352, height = 215, gap = 18;
      const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
      if (step === 0) setCardPosition({ left: clamp(rect.left - width - gap, 16, window.innerWidth - width - 16), top: clamp(rect.top, 16, window.innerHeight - height - 16) });
      else if (step === 1) setCardPosition({ left: clamp(rect.right + gap, 16, window.innerWidth - width - 16), top: clamp(rect.top - 4, 16, window.innerHeight - height - 16) });
      else setCardPosition({ left: clamp(rect.right - width, 16, window.innerWidth - width - 16), top: clamp(rect.bottom + gap, 16, window.innerHeight - height - 16) });
    };
    const frame = window.requestAnimationFrame(updateSpotlight);
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("resize", updateSpotlight); window.removeEventListener("scroll", updateSpotlight, true); };
  }, [step]);
  if (step < 0) return null;
  const finish = () => { localStorage.setItem(key, "complete"); setStep(-1); };
  return <div className="fixed inset-0 z-[70] pointer-events-none">
    {!spotlight && <div className="absolute inset-0 bg-black/55" />}
    {spotlight && <div className="fixed rounded-2xl transition-all duration-300" style={{ top: spotlight.top - 7, left: spotlight.left - 7, width: spotlight.width + 14, height: spotlight.height + 14, boxShadow: "0 0 0 9999px rgba(0,0,0,.55)", border: "2px solid rgba(255,255,255,.9)" }} />}
    <div className="fixed w-[calc(100%-40px)] sm:w-[352px] pointer-events-auto transition-all duration-300" style={cardPosition}><div className="rounded-2xl bg-white p-6 shadow-2xl"><p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C5CFC]">Getting started · {step + 1} / {steps.length}</p><h2 className="mt-2 text-[19px] font-bold text-[#111827]">{steps[step][0]}</h2><p className="mt-2 text-[13px] leading-relaxed text-[#6B7280]">{steps[step][1]}</p><div className="mt-6 flex justify-between"><button onClick={finish} className="text-[13px] font-medium text-[#6B7280]">Skip tour</button><button onClick={() => step === steps.length - 1 ? finish() : setStep(step + 1)} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-white bg-[#7C5CFC]">{step === steps.length - 1 ? "Finish" : "Next"}</button></div></div></div>
  </div>;
}
