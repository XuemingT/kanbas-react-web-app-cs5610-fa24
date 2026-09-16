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

Install and run the React client locally:

```bash
npm install
npm start
```

Demo account: `demo.manager` / `Demo!2026`

To run the full monorepo locally, configure `server/.env` as described in [server/README.md](server/README.md), then use a second terminal:

```bash
npm --prefix server install
npm run server:dev
```

## Deployment

This repository deploys as one Koyeb Web Service. Koyeb builds the React app, and the Express server serves the resulting `build/` directory, `/api`, and Socket.IO from the same domain.

```bash
Build command: npm ci && npm --prefix server install && npm run build
Run command: npm run server:start
```

Set the server environment variables `NODE_ENV=production`, `USE_MONGO=true`, `MONGO_URL`, and `SESSION_SECRET`. No `REACT_APP_REMOTE_SERVER` or cross-origin `CLIENT_ORIGIN` setting is required for this same-origin deployment.
