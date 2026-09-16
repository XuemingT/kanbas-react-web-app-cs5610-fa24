import axios from "axios";

const remoteServer = process.env.REACT_APP_REMOTE_SERVER?.replace(/\/$/, "");
// In the monorepo deployment Express serves this React build, API, and Socket.IO
// from one origin. A separate API URL remains supported for local/split hosting.
export const REMOTE_SERVER = remoteServer || "";
export const api = axios.create({
  baseURL: REMOTE_SERVER,
  withCredentials: true,
});
