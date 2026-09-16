# TeamFlow server

The Express, MongoDB, and Socket.IO service for the TeamFlow monorepo.

Create `server/.env` locally:

```bash
MONGO_URL=your_atlas_connection_string
SESSION_SECRET=long_random_secret
USE_MONGO=true
```

Run `npm --prefix server install` and then `npm run server:dev` from the repository root. In production this server serves the React `../build` directory, so the app, API, session cookie, and WebSocket connection share one origin.
