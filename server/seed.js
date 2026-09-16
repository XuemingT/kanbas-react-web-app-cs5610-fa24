import "dotenv/config";
import mongoose from "mongoose";
import { TeamFlowChannel, TeamFlowEvent, TeamFlowMembership, TeamFlowProject, TeamFlowTask, TeamFlowTeam, TeamFlowTeamMembership, TeamFlowUser } from "./models.js";

if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required");
await mongoose.connect(process.env.MONGO_URL);
const upsertUser = (user) => TeamFlowUser.findOneAndUpdate({ username: user.username }, user, { upsert: true, new: true, setDefaultsOnInsert: true });
const [manager, lead, member, engineer, marketing] = await Promise.all([
  upsertUser({ username: "demo.manager", password: "Demo!2026", firstName: "Alex", lastName: "Morgan", email: "alex@teamflow.demo", role: "MANAGER" }),
  upsertUser({ username: "demo.lead", password: "Demo!2026", firstName: "Jordan", lastName: "Lee", email: "jordan@teamflow.demo", role: "LEAD" }),
  upsertUser({ username: "demo.member", password: "Demo!2026", firstName: "Taylor", lastName: "Chen", email: "taylor@teamflow.demo", role: "MEMBER" }),
  upsertUser({ username: "demo.engineer", password: "Demo!2026", firstName: "Sam", lastName: "Rivera", email: "sam@teamflow.demo", role: "MEMBER" }),
  upsertUser({ username: "demo.marketing", password: "Demo!2026", firstName: "Morgan", lastName: "Kim", email: "morgan@teamflow.demo", role: "MEMBER" }),
]);
const projectRows = [
  ["customer-onboarding", "Customer Onboarding Refresh", "Improve activation with a clear first-run experience.", "ON_TRACK", "#5B6CFF", 30],
  ["q4-launch", "Q4 Product Launch", "Coordinate the release across product and go-to-market.", "AT_RISK", "#A855F7", 60],
  ["analytics-foundation", "Analytics Foundation", "Build trusted metrics for sharper product decisions.", "ON_TRACK", "#14B8A6", 45],
];
const projects = await Promise.all(projectRows.map(([slug, name, description, status, color, days]) => { const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days); return TeamFlowProject.findOneAndUpdate({ slug }, { slug, name, description, status, color, dueDate, owner: manager._id }, { upsert: true, new: true }); }));
const people = [manager, lead, member, engineer, marketing];
for (const project of projects) for (const [user, role] of [[manager, "OWNER"], [lead, "LEAD"], [member, "MEMBER"], [engineer, "MEMBER"], [marketing, "MEMBER"]]) await TeamFlowMembership.findOneAndUpdate({ user: user._id, project: project._id }, { role }, { upsert: true });
const team = await TeamFlowTeam.findOneAndUpdate({ name: "Product & Delivery" }, { name: "Product & Delivery", description: "Cross-functional product team", createdBy: manager._id }, { upsert: true, new: true });
for (const [user, role] of [[manager, "OWNER"], [lead, "LEAD"], [member, "MEMBER"], [engineer, "MEMBER"], [marketing, "MEMBER"]]) await TeamFlowTeamMembership.findOneAndUpdate({ team: team._id, user: user._id }, { role }, { upsert: true });
await TeamFlowChannel.findOneAndUpdate({ team: team._id, type: "GROUP", name: "General" }, { team: team._id, type: "GROUP", name: "General", members: people.map((p) => p._id), createdBy: manager._id }, { upsert: true, new: true });
const taskRows = [["Finalize onboarding flow", 0, lead, "IN_REVIEW", "HIGH", 1], ["Validate activation events", 0, member, "IN_PROGRESS", "HIGH", 3], ["Write empty-state copy", 0, member, "BACKLOG", "MEDIUM", 8], ["Review launch messaging", 1, manager, "IN_PROGRESS", "URGENT", 2], ["Draft release notes", 1, engineer, "BACKLOG", "HIGH", 6], ["QA regression pass", 1, engineer, "BACKLOG", "HIGH", 14], ["Confirm analytics events", 2, member, "BACKLOG", "MEDIUM", 4], ["Dashboard metrics audit", 2, lead, "DONE", "LOW", -2], ["Set up tracking events", 2, member, "IN_REVIEW", "MEDIUM", 9]];
for (const [title, index, assignee, status, priority, days] of taskRows) { const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days); await TeamFlowTask.findOneAndUpdate({ title }, { title, project: projects[index]._id, assignee: assignee._id, status, priority, dueDate }, { upsert: true, new: true }); }
for (const [title, index, days, hour] of [["Weekly product sync", 1, 1, 9], ["Launch standup", 1, 2, 10], ["Onboarding design review", 0, 3, 11], ["Metrics instrumentation review", 2, 5, 14]]) { const startsAt = new Date(); startsAt.setDate(startsAt.getDate() + days); startsAt.setHours(hour, 0, 0, 0); const endsAt = new Date(startsAt.getTime() + 1800000); await TeamFlowEvent.findOneAndUpdate({ title }, { title, project: projects[index]._id, startsAt, endsAt, attendees: people.map((p) => p._id), meetingUrl: "https://meet.teamflow.app/room" }, { upsert: true, new: true }); }
console.log("TeamFlow workspace seeded");
await mongoose.disconnect();
