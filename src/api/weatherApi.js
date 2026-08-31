// Axios is the Promise-based HTTP client required by the Module 7 mini-project.
import axios from "axios";

// This endpoint converts a city name into one or more geographic locations.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
// This endpoint returns current, hourly, and daily weather for coordinates.
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// A shared client keeps the timeout and response format in one place.
const weatherClient = axios.create({
  // Ten seconds prevents a request from waiting forever on a weak connection.
  timeout: 10000,
  // This header asks the service to respond with JSON data.
  headers: { Accept: "application/json" },
});

// This helper checks that a value is a usable finite number.
function isCoordinate(value) {
  // Number.isFinite rejects undefined, text, Infinity, and NaN.
  return Number.isFinite(Number(value));
}

// This function converts Open-Meteo location data into a predictable app shape.
function normalizeLocation(location) {
  // Only properties needed by the interface are returned.
  return {
    // A stable id helps React identify suggestion buttons.
    id: location.id ?? `${location.latitude}-${location.longitude}`,
    // The city or place name appears in headings and search history.
    name: location.name,
    // admin1 is normally the state, province, or region.
    region: location.admin1 ?? "",
    // The country gives similarly named cities useful context.
    country: location.country ?? "",
    // Coordinates are required by the dependent forecast request.
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    // The timezone helps the app interpret local forecast times correctly.
    timezone: location.timezone ?? "auto",
  };
}

// This function searches for up to five matching places for suggestions or selection.
export async function searchLocations(city, { signal, count = 5 } = {}) {
  // Removing outer spaces prevents meaningless requests such as three blank characters.
  const cleanedCity = city.trim();
  // At least two letters are required for a useful suggestion request.
  if (cleanedCity.length < 2) {
    // Returning an empty list is easier for the suggestion interface to handle.
    return [];
  }
  // The console records the request's purpose without exposing confidential information.
  console.log("[weatherApi] Searching locations", { city: cleanedCity, count });
  // Axios safely converts the params object into a query string.
  const response = await weatherClient.get(GEOCODING_URL, {
    // These parameters follow the geocoding request described in the PDF.
    params: { name: cleanedCity, count, language: "en", format: "json" },
    // The AbortController signal cancels an obsolete search.
    signal,
  });
  // Optional chaining protects the app when the API returns no results property.
  const results = response.data?.results ?? [];
  // Mapping normalizes every uncertain external record before components receive it.
  return results
    // Invalid location records are removed before they can cause a forecast error.
    .filter((location) => location?.name && isCoordinate(location.latitude) && isCoordinate(location.longitude))
    // Valid records are converted into the app's smaller location shape.
    .map(normalizeLocation);
}

// This function returns the best location match for a submitted city.
export async function searchLocation(city, options = {}) {
  // The main search needs several matches so the visitor can choose between similar cities.
  const locations = await searchLocations(city, { ...options, count: 5 });
  // A missing match becomes a clear error instead of an undefined-property crash.
  if (locations.length === 0) {
    // This exact message is safe and helpful for the visible error state.
    throw new Error("No matching city was found.");
  }
  // Every match is returned because city selection is one of the optional improvements.
  return locations;
}

// This function retrieves detailed weather for one validated location.
export async function getWeather(latitude, longitude, { signal, temperatureUnit = "celsius" } = {}) {
  // Invalid coordinates are rejected before any network request begins.
  if (!isCoordinate(latitude) || !isCoordinate(longitude)) {
    // A descriptive error makes incorrect caller data easier to diagnose.
    throw new Error("Valid latitude and longitude values are required.");
  }
  // This log helps learners see the dependent second request in the console.
  console.log("[weatherApi] Loading forecast", { latitude, longitude, temperatureUnit });
  // Axios sends the forecast request and automatically parses the returned JSON.
  const response = await weatherClient.get(FORECAST_URL, {
    // The params object states exactly which weather information the project needs.
    params: {
      // The coordinates came from geocoding or browser geolocation.
      latitude,
      longitude,
      // These values power the current-weather card.
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
      ].join(","),
      // These values power the five-day cards and optional sunrise information.
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "sunrise",
        "sunset",
        "precipitation_probability_max",
      ].join(","),
      // These values power a compact 24-hour forecast.
      hourly: ["temperature_2m", "weather_code", "precipitation_probability"].join(","),
      // auto asks Open-Meteo to return times in the searched location's timezone.
      timezone: "auto",
      // Five days is the exact forecast length required by the PDF.
      forecast_days: 5,
      // The interface can switch between Celsius and Fahrenheit.
      temperature_unit: temperatureUnit,
    },
    // This signal stops old requests after a new search begins.
    signal,
  });
  // The parsed weather object is returned to the state-owning Hook.
  return response.data;
}

// This function performs the required dependent city-to-weather request flow.
export async function getCityWeather(city, options = {}) {
  // The location request must finish before coordinates are available.
  const locations = await searchLocation(city, options);
  // The first result is the API's best match and becomes the default choice.
  const location = locations[0];
  // The forecast request uses coordinates returned by the first request.
  const weather = await getWeather(location.latitude, location.longitude, options);
  // Returning all matches enables the optional city-selection interface.
  return { location, locations, weather };
}

// This function loads weather when a user explicitly chooses a suggestion or location.
export async function getLocationWeather(location, options = {}) {
  // The selected location already contains coordinates, so geocoding is unnecessary.
  const weather = await getWeather(location.latitude, location.longitude, options);
  // The shape matches getCityWeather so the consuming Hook remains simple.
  return { location, locations: [location], weather };
}

// This function translates low-level Axios errors into beginner-friendly messages.
export function getWeatherErrorMessage(error) {
  // Deliberate cancellation should not frighten the visitor with an error message.
  if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
    // An empty string tells the Hook not to enter the visible error state.
    return "";
  }
  // A known no-result error already contains the best message.
  if (error.message === "No matching city was found.") {
    // The original safe message is returned unchanged.
    return error.message;
  }
  // Axios uses these codes when its ten-second timeout expires.
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    // The message suggests an immediate recovery action.
    return "The request took too long. Please try again.";
  }
  // error.request means the request was sent but no response arrived.
  if (error.request && !error.response) {
    // The visitor may need to reconnect to the internet.
    return "Unable to reach the weather service. Check your connection and try again.";
  }
  // A rate-limited response receives a specific temporary message.
  if (error.response?.status === 429) {
    // Waiting before retrying avoids repeatedly hitting the limit.
    return "Too many requests were sent. Please wait briefly and try again.";
  }
  // The fallback avoids leaking raw server internals into the interface.
  return "Weather information could not be loaded. Please try again.";
}
