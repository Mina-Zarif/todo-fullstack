const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Path to our JSON "database"
// const DATA_FILE = path.join(__dirname, "todos.json");
let todos = [];

// Middleware
app.use(cors());
app.use(express.json());

// -------------------------
// Database helpers
// -------------------------

function readTodos() {
  // const raw = fs.readFileSync(DATA_FILE, "utf-8");
  // return JSON.parse(raw);
    return todos;
}

function writeTodos(todos) {
  // fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
    todos = newTodos;
}

// -------------------------
// Routes
// -------------------------

app.get("/", (req, res) => {
  try {
    const todos = readTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read todos" });
  }
});

// GET all todos
app.get("/api/todos", (req, res) => {
  try {
    const todos = readTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read todos" });
  }
});

// POST a new todo
app.post("/api/todos", (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Todo text is required",
      });
    }

    const todos = readTodos();

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      done: false,
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create todo",
    });
  }
});

// PATCH/update a todo
app.patch("/api/todos/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const todos = readTodos();

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

    writeTodos(todos);

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update todo",
    });
  }
});

// DELETE a todo
app.delete("/api/todos/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const todos = readTodos();

    const exists = todos.some((todo) => todo.id === id);

    if (!exists) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const updatedTodos = todos.filter(
      (todo) => todo.id !== id
    );

    writeTodos(updatedTodos);

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