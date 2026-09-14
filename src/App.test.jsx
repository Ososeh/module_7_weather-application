// render displays the component in a test browser, while screen finds visible elements.
import { cleanup, render, screen } from "@testing-library/react";
// Vitest supplies the test and assertion functions.
import { afterEach, beforeEach, expect, test } from "vitest";
// App is the same minimal component used by the real project.
import App from "./App.jsx";

// Each test starts without preferences or saved locations from an older test.
beforeEach(() => {
  // Clearing localStorage makes the initial state deterministic.
  window.localStorage.clear();
});

// Each completed test removes its rendered application from the shared document.
afterEach(() => {
  // Cleanup prevents elements from an earlier test appearing in a later test's queries.
  cleanup();
});

// This test verifies the required welcome state and empty-search prevention.
test("starts with the city-search welcome state", () => {
  // The complete application is rendered into the test document.
  render(<App />);
  // The project title confirms that the correct parent component appeared.
  expect(screen.getByRole("heading", { name: "Weather Explorer" })).toBeInTheDocument();
  // The visible initial guidance satisfies the PDF's welcome-state requirement.
  expect(screen.getByRole("heading", { name: "Search for a city" })).toBeInTheDocument();
  // The search button must be disabled while the controlled input is empty.
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
});

// This test verifies the required unit and optional theme controls.
test("shows accessible unit and theme controls", () => {
  // The application is rendered from a clean state.
  render(<App />);
  // Celsius is the initial pressed choice.
  expect(screen.getByRole("button", { name: "°C" })).toHaveAttribute("aria-pressed", "true");
  // Fahrenheit is available but not initially selected.
  expect(screen.getByRole("button", { name: "°F" })).toHaveAttribute("aria-pressed", "false");
  // The theme button clearly states the next available action.
  expect(screen.getByRole("button", { name: "🌙 Dark mode" })).toBeInTheDocument();
});

test("does not render the removed weather API attribution footer", () => {
  render(<App />);
  expect(screen.queryByText(/Weather data provided by Open-Meteo/i)).not.toBeInTheDocument();
});
