// StrictMode helps developers discover unsafe React patterns during development.
import { StrictMode } from "react";
// createRoot connects React to one real element in index.html.
import { createRoot } from "react-dom/client";
// App is deliberately small and delegates the real work to a parent component.
import App from "./App.jsx";
// The stylesheet controls the complete application's responsive appearance.
import "./styles/index.css";

// This statement finds the empty root element and gives it to React.
createRoot(document.getElementById("root")).render(
  // StrictMode performs extra development checks without changing the visible result.
  <StrictMode>
    {/* App begins the project's component tree. */}
    <App />
  </StrictMode>,
);
