// This utility converts condition codes and timestamps for the hourly strip.
import { formatWeatherTime, getWeatherDescription } from "../utils/weatherCode.js";

// This component displays the next twelve hourly records from the API response.
function HourlyForecast({ weather }) {
  // hourly stores parallel arrays for time, temperature, code, and precipitation.
  const hourly = weather.hourly;
  // Find the first forecast time that is not earlier than the current reported time.
  const firstFutureIndex = Math.max(0, hourly.time.findIndex((time) => time >= weather.current.time));
  // Twelve compact objects are easier for JSX to read than four separate sliced arrays.
  const nextHours = hourly.time.slice(firstFutureIndex, firstFutureIndex + 12).map((time, offset) => {
    // This index connects each time to values in the other parallel arrays.
    const index = firstFutureIndex + offset;
    // One normalized object represents one hour.
    return {
      time,
      temperature: hourly.temperature_2m[index],
      weatherCode: hourly.weather_code[index],
      precipitation: hourly.precipitation_probability[index],
    };
  });

  // The returned JSX builds a horizontally scrollable hourly section.
  return (
    <section className="hourly-section" aria-labelledby="hourly-heading">
      <div className="section-heading">
        <p className="eyebrow">Next twelve hours</p>
        <h2 id="hourly-heading">Hourly forecast</h2>
      </div>
      <div className="hourly-list">
        {/* Each time is unique and works as a stable React key. */}
        {nextHours.map((hour) => {
          // The condition supplies a concise icon and accessible label.
          const condition = getWeatherDescription(hour.weatherCode);
          // One article represents one chronological forecast item.
          return (
            <article key={hour.time}>
              <time dateTime={hour.time}>{formatWeatherTime(hour.time, { hour: "numeric" })}</time>
              <span aria-hidden="true">{condition.icon}</span>
              <strong>{Math.round(hour.temperature)}{weather.hourly_units.temperature_2m}</strong>
              <small aria-label={`${hour.precipitation} percent precipitation`}>💧 {hour.precipitation}%</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// This export allows the dashboard to include the optional hourly improvement.
export default HourlyForecast;
