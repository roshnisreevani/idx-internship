import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows loading message when app starts", () => {
  render(<App />);
  expect(screen.getByText(/Loading properties/i)).toBeInTheDocument();
});

test("loading message contains the word properties", () => {
  render(<App />);
  expect(screen.getByText(/properties/i)).toBeInTheDocument();
});

test("loading message is displayed", () => {
  render(<App />);
  expect(screen.getByText("Loading properties...")).toBeTruthy();
});