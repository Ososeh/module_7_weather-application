// ForecastCard displays one daily record while this component handles the list.
import ForecastCard from "./ForecastCard.jsx";

// This component turns parallel daily arrays from Open-Meteo into five cards.
function ForecastList({ weather }) {
  // daily contains one array per requested daily variable.
  const daily = weather.daily;
  // daily_units supplies the temperature symbol returned by the service.
  const units = weather.daily_units;

  // The returned JSX provides the section heading and responsive grid.
  return (
    <section className="forecast-section" aria-labelledby="forecast-heading">
      <div className="section-heading">
        <p className="eyebrow">Five-day outlook</p>
        <h2 id="forecast-heading">Daily forecast</h2>
      </div>
      <div className="forecast-grid">
        {/* The index connects values that Open-Meteo returns in parallel arrays. */}
        {daily.time.map((date, index) => (
          <ForecastCard
            key={date}
            date={date}
            weatherCode={daily.weather_code[index]}
            minimum={daily.temperature_2m_min[index]}
            maximum={daily.temperature_2m_max[index]}
            precipitation={daily.precipitation_probability_max?.[index]}
            temperatureUnit={units.temperature_2m_max}
          />
        ))}
      </div>
    </section>
  );
}

// This export allows the dashboard to display the complete forecast.
export default ForecastList;
