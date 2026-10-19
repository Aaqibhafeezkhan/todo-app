import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('trims whitespace around a new todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: '  buy milk  ' } });
  fireEvent.submit(input.closest('form'));
  expect(screen.getByText('buy milk')).toBeInTheDocument();
});

test('renders todo app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Todo App/i);
  expect(titleElement).toBeInTheDocument();
});
