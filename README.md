# TeamFlow

TeamFlow is a full-stack team workspace demo for projects, tasks, calendars, team chat, and meeting invitations.

## Highlights

- Session-based demo authentication with MongoDB Atlas
- Project and task management with persistent completion state
- Team-scoped People directory, direct messages, and group channels
- Real-time Socket.IO chat
- Meeting invitation workflow: invite, accept/decline, Calendar update, notification
- Responsive Figma-inspired workspace UI and first-run onboarding tour

## Stack

React, TypeScript, Tailwind CSS, Express, Socket.IO, MongoDB Atlas, and Mongoose.

## Local setup

Start the companion Node server first, with `MONGO_URL`, `SESSION_SECRET`, and `USE_MONGO=true` configured. Then run this frontend:

```bash
npm install
npm start
```

Demo account: `demo.manager` / `Demo!2026`

## Deployment

Deploy the frontend as a static site and the Express/Socket.IO server as an always-on web service. Configure `REACT_APP_REMOTE_SERVER` to the deployed API URL and set the server `CLIENT_ORIGIN` to the frontend URL.
