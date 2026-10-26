import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'todos';
const THEME_STORAGE_KEY = 'todo-app-theme';

function getInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const storedTodos = window.localStorage.getItem(STORAGE_KEY);
      if (!storedTodos) return [];

      const parsedTodos = JSON.parse(storedTodos);

      const validTodos =
        Array.isArray(parsedTodos) &&
        parsedTodos.every(
          (todo) =>
            todo !== null &&
            typeof todo === 'object' &&
            typeof todo.id === 'number' &&
            typeof todo.text === 'string' &&
            typeof todo.completed === 'boolean'
        );

      return validTodos ? parsedTodos : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Keep the app usable if storage is blocked or full.
    }
  }, [todos]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme switching still works for the current session.
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

      if (e.key === 'n') {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInput('');
    }
  };

  const addTodo = (e) => {
    e.preventDefault();

    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false
        }
      ]);

      setInput('');
      inputRef.current.focus();
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const remaining = todos.filter(todo => !todo.completed).length;
  const completed = todos.length - remaining;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </header>

      <form onSubmit={addTodo} className="todo-form">
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleInputKeyDown}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
          aria-label="New task"
        />

        <button
          type="submit"
          className="add-btn"
          disabled={!input.trim()}
        >
          Add
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

              if (e.key === 'x') {
                toggleTodo(todo.id);
              }
            }}
          >
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>

            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
              aria-label={`Delete ${todo.text}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="todo-footer">
          <p className="remaining">
            {remaining} of {todos.length} remaining
          </p>

          {completed > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="clear-btn"
            >
              Clear completed
            </button>
          )}
        </div>
      )}

      {todos.length === 0 && (
        <p className="empty" role="status">
          No tasks yet. Add one above!
        </p>
      )}
    </div>
  );
}

export default App;
