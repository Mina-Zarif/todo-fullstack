import { useEffect, useState } from "react";
import "./App.css";

// This is the address of our BACKEND server.
// The frontend (this file) and backend (server.js) are two separate
// programs running on two separate ports. The frontend has to "fetch"
// data from the backend over HTTP, just like it would from any API.
const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://localhost:3001/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs once when the app first loads: go fetch the current list.
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setError("");
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Could not reach the server");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError("Can't connect to the backend. Is it running on port 3001?");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
    setText("");
  }

  async function toggleTodo(todo) {
    const res = await fetch(`${API_URL}/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="page">
      <div className="pad">
        <div className="pad-rings" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="ring" />
          ))}
        </div>

        <div className="pad-content">
          <header className="pad-header">
            <h1>To-Do</h1>
            <span className="count">
              {loading ? "…" : `${remaining} left`}
            </span>
          </header>

          {error && <p className="error">{error}</p>}

          <form className="add-form" onSubmit={addTodo}>
            <input
              type="text"
              placeholder="Write something down…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" aria-label="Add todo">
              +
            </button>
          </form>

          <ul className="todo-list">
            {!loading && todos.length === 0 && !error && (
              <li className="empty">Nothing here yet. Add your first item above.</li>
            )}

            {todos.map((todo) => (
              <li key={todo.id} className={`todo-row ${todo.done ? "done" : ""}`}>
                <button
                  className="checkbox"
                  onClick={() => toggleTodo(todo)}
                  aria-label={todo.done ? "Mark as not done" : "Mark as done"}
                >
                  {todo.done && "✓"}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  className="delete"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete todo"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
