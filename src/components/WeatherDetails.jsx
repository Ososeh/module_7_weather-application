// These utilities convert wind degrees and API times into readable text.
import { formatWeatherTime, getWindDirection } from "../utils/weatherCode.js";

// This reusable component displays the detailed values beneath current conditions.
function WeatherDetails({ weather }) {
  // Short local names make the JSX easier for beginners to read.
  const current = weather.current;
  // Unit strings come directly from the API response as required by the testing checklist.
  const units = weather.current_units;
  // Daily values contain today's sunrise, sunset, and precipitation probability.
  const daily = weather.daily;

  // The returned JSX builds a responsive definition-style grid.
  return (
    <div className="weather-details" aria-label="Weather details">
      <article>
        <span>Humidity</span>
        <strong>{current.relative_humidity_2m}{units.relative_humidity_2m}</strong>
      </article>
      <article>
        <span>Wind</span>
        <strong>
          {current.wind_speed_10m} {units.wind_speed_10m} {getWindDirection(current.wind_direction_10m)}
        </strong>
      </article>
      <article>
        <span>Precipitation</span>
        <strong>{daily.precipitation_probability_max?.[0] ?? 0}{weather.daily_units.precipitation_probability_max}</strong>
      </article>
      <article>
        <span>Sunrise</span>
        <strong>{formatWeatherTime(daily.sunrise?.[0], { hour: "numeric", minute: "2-digit" })}</strong>
      </article>
      <article>
        <span>Sunset</span>
        <strong>{formatWeatherTime(daily.sunset?.[0], { hour: "numeric", minute: "2-digit" })}</strong>
      </article>
      <article>
        <span>Time zone</span>
        <strong>{weather.timezone_abbreviation ?? weather.timezone}</strong>
      </article>
    </div>
  );
}

// This export allows CurrentWeather to delegate its details grid.
export default WeatherDetails;
