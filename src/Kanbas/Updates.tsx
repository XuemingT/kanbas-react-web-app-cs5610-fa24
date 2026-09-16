import { FiMoreHorizontal, FiPlusCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getWorkspace } from "./teamflowClient";

export default function Updates() {
  const [activity, setActivity] = useState<any[]>([]);
  useEffect(() => { getWorkspace().then((workspace) => setActivity(workspace.activity)).catch(console.error); }, []);
  return <div className="tf-page tf-updates-page"><header className="tf-page-header"><div><p className="tf-eyebrow">WORKSPACE ACTIVITY</p><h1>Updates</h1><p>A shared feed for the work your team is moving forward.</p></div><button className="btn btn-outline-secondary"><FiMoreHorizontal /></button></header><div className="tf-updates-layout"><section className="tf-feed"><div className="tf-feed-heading"><h2>Recent activity</h2><button className="btn btn-sm btn-light">Mark all read</button></div>{activity.map((update) => <article className="tf-activity" key={update._id}><span className="tf-avatar blue">{`${update.actor?.firstName?.[0] || "T"}${update.actor?.lastName?.[0] || "F"}`}</span><div><p><strong>{`${update.actor?.firstName || "Team"} ${update.actor?.lastName || ""}`}</strong> {update.message} <b>{update.task?.title}</b></p><span>{update.project?.name} · {new Date(update.createdAt).toLocaleDateString()}</span></div></article>)}{!activity.length && <p className="p-4 text-muted">No activity yet.</p>}</section><aside className="tf-update-aside"><FiPlusCircle /><h2>Keep work visible</h2><p>Updates collect task changes and conversations from every project channel.</p><button className="btn btn-primary w-100">Open a project</button></aside></div></div>;
}
