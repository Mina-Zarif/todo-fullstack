// server.js
//
// This is our BACKEND. Its job is simple:
//   1. Keep the list of to-dos somewhere safe (here: a JSON file on disk).
//   2. Let the FRONTEND ask for that list, and let it add/update/delete items.
//
// We do that by exposing a small "REST API" — a set of URLs (endpoints) that
// respond to specific HTTP methods:
//   GET    /api/todos       -> "give me all the todos"
//   POST   /api/todos       -> "add a new todo"
//   PATCH  /api/todos/:id   -> "update this one todo" (e.g. mark it done)
//   DELETE /api/todos/:id   -> "delete this one todo"

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "todos.json");

// --- Middleware ---
// cors() lets our React app (running on a different port, 5173) call this
// server (running on port 3001) without the browser blocking the request.
app.use(cors());
// express.json() lets us read JSON data the frontend sends us (e.g. new todo text).
app.use(express.json());

// --- Tiny "database" helpers ---
// Real apps usually use a proper database (Postgres, MongoDB, etc).
// For learning purposes, a JSON file is perfect: you can open todos.json
// yourself and literally watch it change as you use the app.
function readTodos() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// --- Routes ---

// GET all todos
app.get("/api/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST a new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Todo text is required" });
  }

  const todos = readTodos();
  const newTodo = {
    id: Date.now(), // good enough unique id for a small learning project
    text: text.trim(),
    done: false,
  };

  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});

// PATCH (update) a todo — used here to toggle "done" or edit text
app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todos = readTodos();
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (typeof req.body.done === "boolean") todo.done = req.body.done;
  if (typeof req.body.text === "string" && req.body.text.trim()) {
    todo.text = req.body.text.trim();
  }

  writeTodos(todos);
  res.json(todo);
});

// DELETE a todo
app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  let todos = readTodos();
  const exists = todos.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos = todos.filter((t) => t.id !== id);
  writeTodos(todos);

  res.status(204).end();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
