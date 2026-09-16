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

This repository deploys as one Google Compute Engine VM. Express serves the resulting `build/` directory, `/api`, and Socket.IO from the same domain; Caddy provides HTTPS and reverse-proxies requests to the Node process.

```bash
Build the application on the VM:

npm ci && npm --prefix server ci && npm run build
```

Create `server/.env` on the VM with `NODE_ENV=production`, `USE_MONGO=true`, `MONGO_URL`, and `SESSION_SECRET`, then run `server/index.js` with PM2. No `REACT_APP_REMOTE_SERVER` or cross-origin `CLIENT_ORIGIN` setting is required for this same-origin deployment.
