import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput('');
      inputRef.current.focus();
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
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
      <h1>Todo App</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
              aria-label={`Delete ${todo.text}`}
            >×</button>
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
            >Clear completed</button>
          )}
        </div>
      )}
      {todos.length === 0 && (
        <p className="empty" role="status">No tasks yet. Add one above!</p>
      )}
    </div>
  );
}

export default App;
