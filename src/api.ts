import axios from "axios";

const remoteServer = process.env.REACT_APP_REMOTE_SERVER?.replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && !remoteServer) {
  throw new Error("REACT_APP_REMOTE_SERVER must be configured for production");
}

export const REMOTE_SERVER = remoteServer || "";
export const api = axios.create({
  baseURL: REMOTE_SERVER,
  withCredentials: true,
});
