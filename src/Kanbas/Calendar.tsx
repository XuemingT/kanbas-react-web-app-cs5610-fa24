import { FiChevronLeft, FiChevronRight, FiClock, FiVideo } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getWorkspace } from "./teamflowClient";

export default function Calendar() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => { getWorkspace().then((workspace) => setEvents(workspace.events)).catch(console.error); }, []);
  const displayEvents = events.map((event) => ({
    day: new Date(event.startsAt).getDate().toString(), title: event.title,
    time: new Date(event.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    team: event.project?.name || "Workspace", tone: "blue",
  }));
  return <div className="tf-page tf-calendar-page">
    <header className="tf-page-header"><div><p className="tf-eyebrow">TEAM SCHEDULE</p><h1>Calendar</h1><p>Meetings, delivery checkpoints, and deadlines in one view.</p></div><button className="btn btn-primary">Create event</button></header>
    <div className="tf-calendar-toolbar"><div className="btn-group"><button className="btn btn-light"><FiChevronLeft /></button><button className="btn btn-light"><FiChevronRight /></button></div><strong>September 2026</strong><button className="btn btn-outline-secondary">Today</button></div>
    <div className="tf-calendar-layout"><section className="tf-week"><div className="tf-week-head">{["Mon 15","Tue 16","Wed 17","Thu 18","Fri 19"].map((day, i) => <div className={i === 1 ? "today" : ""} key={day}>{day}</div>)}</div><div className="tf-week-grid">{Array.from({length: 25}, (_,i)=><div key={i} className="tf-time-cell">{i % 5 === 0 ? `${9 + Math.floor(i / 5)}:00` : ""}</div>)}</div></section>
    <aside className="tf-agenda"><h2>Upcoming</h2>{displayEvents.map(event => <article className="tf-event" key={event.title}><span className={`tf-event-day ${event.tone}`}>{event.day}</span><div><strong>{event.title}</strong><p><FiClock /> {event.time}</p><p>{event.team}</p></div><FiVideo className="tf-event-video" /></article>)}{!displayEvents.length && <p className="text-muted small">No upcoming events.</p>}</aside></div>
  </div>;
}
