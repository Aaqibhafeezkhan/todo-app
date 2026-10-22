import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('trims whitespace around a new todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: '  buy milk  ' } });
  fireEvent.submit(input.closest('form'));
  expect(screen.getByText('buy milk')).toBeInTheDocument();
});

test('labels the delete button with the todo text', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'walk the dog' } });
  fireEvent.submit(input.closest('form'));
  expect(screen.getByRole('button', { name: /delete walk the dog/i })).toBeInTheDocument();
});

test('keeps focus in the input after adding a todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'call the plumber' } });
  fireEvent.submit(input.closest('form'));
  expect(input).toHaveFocus();
});

test('disables the add button until there is a task to add', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
  fireEvent.change(input, { target: { value: 'read a book' } });
  expect(screen.getByRole('button', { name: /^add$/i })).toBeEnabled();
  fireEvent.change(input, { target: { value: '   ' } });
  expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
});

test('renders todo app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Todo App/i);
  expect(titleElement).toBeInTheDocument();
});

test('clears completed todos but keeps the open ones', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'water the plants' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'take out the bins' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('water the plants'));
  fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
  expect(screen.queryByText('water the plants')).not.toBeInTheDocument();
  expect(screen.getByText('take out the bins')).toBeInTheDocument();
});

test('counts the todos that are still open', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'water the plants' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'take out the bins' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('water the plants'));
  expect(screen.getByText('1 of 2 remaining')).toBeInTheDocument();
});
