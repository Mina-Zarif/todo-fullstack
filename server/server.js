const express = require("express");
const cors = require("cors");
const { kv } = require("@vercel/kv");

const app = express();

// Key under which the todos array is stored in Vercel KV
const TODOS_KEY = "todos";

// Middleware
app.use(cors());
app.use(express.json());

// -------------------------
// Database helpers
// -------------------------

async function readTodos() {
  const todos = await kv.get(TODOS_KEY);
  return todos || [];
}

async function writeTodos(newTodos) {
  await kv.set(TODOS_KEY, newTodos);
}

// -------------------------
// Routes
// -------------------------

app.get("/", async (req, res) => {
  try {
    const todos = await readTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read todos" });
  }
});

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await readTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read todos" });
  }
});

// POST a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Todo text is required",
      });
    }

    const todos = await readTodos();

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      done: false,
    };

    todos.push(newTodo);
    await writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create todo",
    });
  }
});

// PATCH/update a todo
app.patch("/api/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const todos = await readTodos();

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    if (typeof req.body.done === "boolean") {
      todo.done = req.body.done;
    }

    if (
      typeof req.body.text === "string" &&
      req.body.text.trim()
    ) {
      todo.text = req.body.text.trim();
    }

    await writeTodos(todos);

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update todo",
    });
  }
});

// DELETE a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const todos = await readTodos();

    const exists = todos.some((todo) => todo.id === id);

    if (!exists) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const updatedTodos = todos.filter(
      (todo) => todo.id !== id
    );

    await writeTodos(updatedTodos);

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete todo",
    });
  }
});

// Vercel serverless entry point
module.exports = app;