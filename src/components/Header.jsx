// This component presents the app identity and its two persistent preferences.
function Header({ onToggleTheme, onUnitChange, temperatureUnit, theme }) {
  // The returned JSX builds the top banner.
  return (
    <header className="app-header">
      {/* This inner wrapper keeps header content aligned with the main page. */}
      <div className="header-content">
        {/* The text block introduces the project's purpose. */}
        <div>
          <p className="eyebrow">Live forecast</p>
          <h1>Weather Explorer</h1>
          <p>Search any city to view current conditions, hourly detail, and a five-day forecast.</p>
        </div>
        {/* These controls provide optional temperature and theme improvements. */}
        <div className="header-controls" aria-label="Display preferences">
          {/* This grouped control changes the unit returned by the API. */}
          <div className="segmented-control" aria-label="Temperature unit">
            <button
              aria-pressed={temperatureUnit === "celsius"}
              type="button"
              onClick={() => onUnitChange("celsius")}
            >
              °C
            </button>
            <button
              aria-pressed={temperatureUnit === "fahrenheit"}
              type="button"
              onClick={() => onUnitChange("fahrenheit")}
            >
              °F
            </button>
          </div>
          {/* This button exposes the next action rather than only the current theme. */}
          <button className="theme-button" type="button" onClick={onToggleTheme}>
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
        </div>
      </div>
    </header>
  );
}

// This export allows the dashboard parent to display Header.
export default Header;
