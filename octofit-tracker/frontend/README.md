# OctoFit Tracker frontend

The React 19 and Vite presentation tier uses React Router to browse activities,
the leaderboard, teams, users, and workout suggestions. It requests data from
the Express API on port `8000`.

## Configure the API URL

When running in GitHub Codespaces, define `VITE_CODESPACE_NAME` in
`octofit-tracker/frontend/.env.local`, using the value of the Codespace name:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite uses this to request
`https://<VITE_CODESPACE_NAME>-8000.app.github.dev`. Restart the Vite server
after changing `.env.local`. If the variable is absent or invalid, the frontend
uses `http://localhost:8000`, which is suitable for local development.

## Run locally

Start the backend and MongoDB on port `8000` and `27017`, then run:

```bash
npm run dev --prefix octofit-tracker/frontend
```

The Vite development server listens on port `5173`.
