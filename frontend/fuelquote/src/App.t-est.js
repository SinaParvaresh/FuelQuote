import { render, screen } from '@testing-library/react';
import App from './App';

test('Checks that homepage loads correctly when app starts', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the Fuel Quote Website of GROUP 33!!!/);
  expect(linkElement).toBeInTheDocument();
});
