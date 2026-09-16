import "dotenv/config";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { TeamFlowChannel, TeamFlowMessage, TeamFlowUser } from "./models.js";

const port = process.env.PORT || 4000;
const mongoUrl = process.env.MONGO_URL || process.env.MONGO_CONNECTION_STRING;
const secret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && (!mongoUrl || !secret)) throw new Error("MONGO_URL and SESSION_SECRET must be configured in production");

const app = express();
const server = createServer(app);
const sessionMiddleware = session({ secret: secret || "development-only-secret", resave: false, saveUninitialized: false, cookie: process.env.NODE_ENV === "production" ? { secure: true, sameSite: "lax" } : { secure: false } });
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(express.json());
app.use(sessionMiddleware);

const io = new Server(server, { cors: { origin: true, credentials: true } });
io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
io.use((socket, next) => socket.request.session?.teamFlowUserId ? next() : next(new Error("Unauthorized")));
io.on("connection", (socket) => {
  socket.on("teamflow:join", async ({ channelId }) => { const userId = socket.request.session.teamFlowUserId; if (channelId && await TeamFlowChannel.exists({ _id: channelId, members: userId })) socket.join(`channel:${channelId}`); });
  socket.on("teamflow:message", async ({ channelId, body }) => { const userId = socket.request.session.teamFlowUserId; if (!channelId || !body?.trim() || !await TeamFlowChannel.exists({ _id: channelId, members: userId })) return; const [message, sender] = await Promise.all([TeamFlowMessage.create({ channel: channelId, sender: userId, body: body.trim() }), TeamFlowUser.findById(userId).select("firstName lastName").lean()]); io.to(`channel:${channelId}`).emit("teamflow:message", { _id: message._id, channelId, sender: { _id: userId, firstName: sender.firstName, lastName: sender.lastName }, body: message.body, createdAt: message.createdAt }); });
});

app.get("/__ping", (_req, res) => res.type("text").send("pong"));
routes(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, "../build");
app.use(express.static(buildDir));
app.get("*", (_req, res) => res.sendFile(path.join(buildDir, "index.html")));

const start = async () => { try { if (process.env.USE_MONGO === "true") { if (!mongoUrl) throw new Error("MONGO_URL is required when USE_MONGO is true"); await mongoose.connect(mongoUrl); console.log("MongoDB connected"); } server.listen(port, () => console.log(`TeamFlow running on port ${port}`)); } catch (error) { console.error(error); process.exit(1); } };
start();
