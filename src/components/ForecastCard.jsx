// These utilities translate a WMO code and safely format a daily date.
import { formatWeatherTime, getWeatherDescription } from "../utils/weatherCode.js";

// This component displays one day from the required five-day forecast.
function ForecastCard({ date, maximum, minimum, precipitation, temperatureUnit, weatherCode }) {
  // The numeric code becomes a readable weather condition.
  const condition = getWeatherDescription(weatherCode);
  // Midday avoids a timezone boundary moving the displayed calendar day unexpectedly.
  const formattedDate = formatWeatherTime(`${date}T12:00:00`, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // The returned JSX builds one compact forecast article.
  return (
    <article className="forecast-card">
      <h3>{formattedDate}</h3>
      {/* The weather emoji is decorative because the label follows it. */}
      <span className="forecast-icon" aria-hidden="true">{condition.icon}</span>
      <p>{condition.label}</p>
      {/* The accessible label explains which number is maximum and minimum. */}
      <div className="forecast-temperatures" aria-label={`High ${Math.round(maximum)}, low ${Math.round(minimum)}`}>
        <strong>{Math.round(maximum)}{temperatureUnit}</strong>
        <span>{Math.round(minimum)}{temperatureUnit}</span>
      </div>
      <small>💧 {precipitation ?? 0}%</small>
    </article>
  );
}

// This export allows ForecastList to create five cards.
export default ForecastCard;
