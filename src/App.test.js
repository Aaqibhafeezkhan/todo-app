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

test('renders todo app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Todo App/i);
  expect(titleElement).toBeInTheDocument();
});
