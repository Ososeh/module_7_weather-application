// WeatherDetails keeps the parent current card focused on summary information.
import WeatherDetails from "./WeatherDetails.jsx";
// These utilities translate numeric condition codes and timestamps.
import { formatWeatherTime, getWeatherDescription } from "../utils/weatherCode.js";

// This component displays the searched place and its current conditions.
function CurrentWeather({ isFavourite, location, onToggleFavourite, weather }) {
  // current contains values measured or modelled for the current time.
  const current = weather.current;
  // current_units prevents the interface from assuming Celsius or a wind unit.
  const currentUnits = weather.current_units;
  // The WMO code becomes a readable label, icon, and background theme.
  const condition = getWeatherDescription(current.weather_code);
  // Empty region values are removed before joining the visible location label.
  const locationLabel = [location.name, location.region, location.country].filter(Boolean).join(", ");

  // The returned JSX builds the main weather result card.
  return (
    <section className={`current-weather weather-${condition.theme}`} aria-labelledby="current-location-heading">
      {/* This heading row identifies the place, timestamp, and favourite control. */}
      <div className="current-heading">
        <div>
          <p className="eyebrow">Current weather</p>
          <h2 id="current-location-heading">{locationLabel}</h2>
          <p>Updated {formatWeatherTime(current.time, { dateStyle: "medium", timeStyle: "short" })}</p>
        </div>
        <div className="current-actions">
          {/* The icon is decorative because the adjacent condition label says the same thing. */}
          <span className="weather-icon" aria-hidden="true">{condition.icon}</span>
          {/* aria-pressed explains whether the location is already saved. */}
          <button
            className="favourite-button"
            type="button"
            aria-pressed={isFavourite}
            onClick={() => onToggleFavourite(location)}
          >
            {isFavourite ? "★ Saved" : "☆ Save city"}
          </button>
        </div>
      </div>
      {/* This row emphasizes temperature and the human-readable condition. */}
      <div className="temperature-row">
        <strong>{Math.round(current.temperature_2m)}{currentUnits.temperature_2m}</strong>
        <div>
          <h3>{condition.label}</h3>
          <p>
            Feels like {Math.round(current.apparent_temperature)}{currentUnits.apparent_temperature}
          </p>
        </div>
      </div>
      {/* Detailed values live in their own reusable component. */}
      <WeatherDetails weather={weather} />
    </section>
  );
}

// This export allows the dashboard to show the current result.
export default CurrentWeather;
