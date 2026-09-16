# TeamFlow Workspace

TeamFlow is a full-stack collaboration workspace for teams to plan projects, manage tasks, schedule meetings, and communicate in real time.

## Features

- Session-based authentication backed by MongoDB Atlas
- Project lifecycle management: active, completed, and archived projects
- Task management with persistent completion state and automatic project progress
- Team-scoped People directory, direct messages, and group channels
- Real-time Socket.IO chat
- Meeting invitation workflow: invite, accept/decline, Calendar update, notification
- Responsive Figma-inspired workspace UI and first-run onboarding tour

## Tech stack

React, TypeScript, Tailwind CSS, Express, Socket.IO, MongoDB Atlas, and Mongoose.

## Local setup

Start the companion [TeamFlow API](https://github.com/XuemingT/teamflow-api) first, with `MONGO_URL`, `SESSION_SECRET`, and `USE_MONGO=true` configured. Then run this frontend:

```bash
npm install
npm start
```

Demo account: `demo.manager` / `Demo!2026`

## Environment variables

For a separate frontend deployment, configure the API URL at build time:

```bash
REACT_APP_REMOTE_SERVER=https://your-api-host
```

For local development, the CRA proxy targets `http://localhost:4000` automatically.
