// WeatherDashboard is the properly named parent component that owns the project.
import WeatherDashboard from "./components/layout/WeatherDashboard.jsx";

// App remains intentionally small, as requested for practice projects.
function App() {
  // App only calls the parent component and contains no application logic.
  return <WeatherDashboard />;
}

// This export allows main.jsx to import and render App.
export default App;
