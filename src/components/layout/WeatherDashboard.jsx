// All visual sections are imported directly so their responsibilities remain easy to trace.
import CurrentWeather from "../CurrentWeather.jsx";
import ForecastList from "../ForecastList.jsx";
import Header from "../Header.jsx";
import HourlyForecast from "../HourlyForecast.jsx";
import LoadingSkeleton from "../LoadingSkeleton.jsx";
import SavedLocations from "../SavedLocations.jsx";
import SearchForm from "../SearchForm.jsx";
import StatusMessage from "../StatusMessage.jsx";
// This custom Hook owns API requests, persistence, cancellation, and dashboard state.
import useWeatherDashboard from "../../hooks/useWeatherDashboard.js";
// This custom Hook reports browser connection changes.
import useOnlineStatus from "../../hooks/useOnlineStatus.js";
// The weather theme changes the page background based on current conditions.
import { getWeatherDescription } from "../../utils/weatherCode.js";

// This parent component is the only application component called by App.jsx.
function WeatherDashboard() {
  // Destructuring gives each state value and action a readable local name.
  const {
    changeTemperatureUnit,
    error,
    favourites,
    getSuggestions,
    isCurrentFavourite,
    recentSearches,
    retrySearch,
    searchCity,
    selectLocation,
    status,
    temperatureUnit,
    theme,
    toggleFavourite,
    toggleTheme,
    useCurrentLocation,
    weatherData,
  } = useWeatherDashboard();
  // The browser connection status supports clear offline feedback.
  const isOnline = useOnlineStatus();
  // One derived boolean makes loading checks concise throughout JSX.
  const isLoading = status === "loading";
  // A success result supplies a condition-specific background theme.
  const weatherTheme = weatherData
    ? getWeatherDescription(weatherData.weather.current.weather_code).theme
    : "default";

  // The returned JSX coordinates every reusable component and interface state.
  return (
    <div className={`weather-app page-weather-${weatherTheme}`}>
      <Header
        onToggleTheme={toggleTheme}
        onUnitChange={changeTemperatureUnit}
        temperatureUnit={temperatureUnit}
        theme={theme}
      />
      <main className="app-container">
        <SearchForm
          getSuggestions={getSuggestions}
          isLoading={isLoading}
          onLocationSearch={selectLocation}
          onSearch={searchCity}
          onUseCurrentLocation={useCurrentLocation}
        />
        <SavedLocations favourites={favourites} onSelect={selectLocation} recentSearches={recentSearches} />
        {/* Offline feedback remains visible before request-specific states. */}
        {!isOnline && (
          <StatusMessage
            type="offline"
            title="You appear to be offline"
            message="Reconnect to the internet before searching for fresh weather information."
          />
        )}
        {/* An accessible text status and visual skeleton appear while requests run. */}
        {isLoading && (
          <>
            <p className="visually-hidden" role="status">Finding the location and retrieving its latest forecast.</p>
            <LoadingSkeleton />
          </>
        )}
        {/* A failed request clears old results and offers the required retry action. */}
        {!isLoading && status === "error" && (
          <StatusMessage
            type="error"
            title="Unable to load weather"
            message={error}
            onAction={retrySearch}
          />
        )}
        {/* The initial welcome state explains the application's first action. */}
        {!isLoading && status === "initial" && (
          <StatusMessage
            title="Search for a city"
            message="Enter a city above or use your current location to view current weather and the five-day forecast."
          />
        )}
        {/* Every success-only component receives validated API data. */}
        {!isLoading && status === "success" && weatherData && (
          <div className="weather-results">
            <CurrentWeather
              isFavourite={isCurrentFavourite}
              location={weatherData.location}
              onToggleFavourite={toggleFavourite}
              weather={weatherData.weather}
            />
            <HourlyForecast weather={weatherData.weather} />
            <ForecastList weather={weatherData.weather} />
          </div>
        )}
      </main>
      {/* The provider attribution explains where the live information comes from. */}
      <footer className="app-footer">
        <p>Weather data provided by Open-Meteo. No private API key is required or exposed.</p>
      </footer>
    </div>
  );
}

// This export allows the deliberately small App.jsx to call the parent component.
export default WeatherDashboard;
