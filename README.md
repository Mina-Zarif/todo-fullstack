# My First Full-Stack App: To-Do List

This project has two parts that run **at the same time**:

- **`server/`** — the backend (Node.js + Express). It stores your to-dos and
  answers requests from the frontend. Runs on `http://localhost:3001`.
- **`client/`** — the frontend (React, built with Vite). This is what you see
  and click in the browser. Runs on `http://localhost:5173`.

They're separate programs that talk to each other over HTTP — that's what
"full-stack" means: a frontend (what the user sees) + a backend (where the
data lives and the logic runs).

## Before you start

You need **Node.js** installed on your computer. Check by running:

```
node -v
```

If that gives an error, install Node from https://nodejs.org (get the LTS
version), then come back here.

## 1. Run the backend

Open a terminal:

```
cd server
npm install
npm start
```

You should see:
```
✅ Backend server running at http://localhost:3001
```

Leave this terminal open — the backend needs to keep running.

## 2. Run the frontend

Open a **second, separate** terminal:

```
cd client
npm install
npm run dev
```

You'll see a message with a link, usually `http://localhost:5173`. Open that
in your browser — that's your app!

## How it works

- `server/todos.json` is your "database" — literally just a text file. Open
  it in a text editor and watch it change as you add/check/delete items in
  the app. This is the simplest possible way to persist data, and it's a
  great way to *see* what "the backend storing data" actually means.
- `server/server.js` is the API. It has 4 endpoints:
  - `GET /api/todos` — get the list
  - `POST /api/todos` — add an item
  - `PATCH /api/todos/:id` — update an item (e.g. mark done)
  - `DELETE /api/todos/:id` — remove an item
- `client/src/App.jsx` is the whole UI. It calls those endpoints with
  `fetch()` and updates what's on screen using React's `useState`.

## Ideas to try next (great ways to learn more)

- Add an "edit" button that lets you change existing text (the backend
  already supports this via `PATCH`).
- Add categories or due dates to each to-do.
- Swap `todos.json` for a real database like SQLite once you're comfortable.
- Deploy it: put the backend on Render/Railway and the frontend on Vercel/Netlify.

## Troubleshooting

- **"Can't connect to the backend" in the app** → make sure the `server`
  terminal is still running and says port 3001.
- **`npm install` errors** → make sure you're inside the `server` or `client`
  folder when running it, and that Node is installed.
- **Port already in use** → close any other terminal that might already be
  running the app, or restart your computer's terminal.
