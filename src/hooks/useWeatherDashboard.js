// React Hooks give the dashboard state, stable callbacks, cleanup, and cancellation references.
import { useCallback, useEffect, useRef, useState } from "react";
// These service functions keep Axios and endpoint details outside visual components.
import {
  getCityWeather,
  getLocationWeather,
  getWeatherErrorMessage,
  searchLocations,
} from "../api/weatherApi.js";
// These helpers safely read and write optional persistent preferences.
import { readStoredValue, writeStoredValue } from "../utils/storage.js";

// This constant limits history so saved data remains small and useful.
const MAX_RECENT_SEARCHES = 5;

// This helper creates a stable comparison key for one location.
function locationKey(location) {
  // Coordinates distinguish places that share the same city name.
  return `${location.latitude}:${location.longitude}`;
}

// This helper places a location first while removing duplicates and limiting length.
function addUniqueLocation(list, location, maximum = list.length + 1) {
  // The chosen location is placed before every older non-matching location.
  return [location, ...list.filter((item) => locationKey(item) !== locationKey(location))].slice(0, maximum);
}

// This custom Hook owns the mini-project's complete data and request workflow.
export default function useWeatherDashboard() {
  // Weather data begins empty so the interface can display its welcome state.
  const [weatherData, setWeatherData] = useState(null);
  // One named status represents initial, loading, success, or error without conflicting booleans.
  const [status, setStatus] = useState("initial");
  // Error stores a safe message for the visitor rather than a raw Axios object.
  const [error, setError] = useState("");
  // lastSearch stores the retry label and most recent submitted city text.
  const [lastSearch, setLastSearch] = useState("");
  // lastLocation stores coordinates for unit switching and exact retry behaviour.
  const [lastLocation, setLastLocation] = useState(null);
  // Temperature preference survives refreshes through a lazy localStorage read.
  const [temperatureUnit, setTemperatureUnit] = useState(() => readStoredValue("temperature-unit", "celsius"));
  // Theme preference also survives refreshes.
  const [theme, setTheme] = useState(() => readStoredValue("theme", "light"));
  // Recent searches are optional convenience data saved in the same browser.
  const [recentSearches, setRecentSearches] = useState(() => readStoredValue("recent-searches", []));
  // Favourite locations are optional convenience data saved in the same browser.
  const [favourites, setFavourites] = useState(() => readStoredValue("favourites", []));
  // One ref owns the most recent main weather request's AbortController.
  const activeWeatherController = useRef(null);
  // Another ref owns the most recent suggestion request's AbortController.
  const activeSuggestionController = useRef(null);

  // This effect synchronizes the React theme value with the document's visual theme attribute.
  useEffect(() => {
    // CSS reads this attribute to choose light or dark colours.
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // This effect cancels unfinished requests when the dashboard leaves the page.
  useEffect(() => {
    // The returned cleanup function runs during component removal.
    return () => {
      // Optional chaining calls abort only when a controller exists.
      activeWeatherController.current?.abort();
      // Suggestion work is cancelled for the same cleanup reason.
      activeSuggestionController.current?.abort();
    };
  }, []);

  // This helper stores a successful location in recent-search history.
  const rememberLocation = useCallback((location) => {
    // Functional state updates always receive the latest list.
    setRecentSearches((currentSearches) => {
      // The new location appears first and older duplicates are removed.
      const updatedSearches = addUniqueLocation(currentSearches, location, MAX_RECENT_SEARCHES);
      // Persistence happens within the user-triggered request completion rather than a separate effect.
      writeStoredValue("recent-searches", updatedSearches);
      // Returning the list tells React to update the visible recent-search buttons.
      return updatedSearches;
    });
  }, []);

  // This shared runner manages cancellation and all four request-interface states.
  const runWeatherRequest = useCallback(async (requestFunction, retryLabel) => {
    // A newer main request makes the previous result obsolete.
    activeWeatherController.current?.abort();
    // This controller belongs only to the new request.
    const controller = new AbortController();
    // Saving the controller makes future cancellation possible.
    activeWeatherController.current = controller;
    // Loading feedback begins before asynchronous work starts.
    setStatus("loading");
    // A previous error must disappear before a new attempt.
    setError("");
    // The PDF requires old results to be cleared after a failed search, so a new attempt begins cleanly.
    setWeatherData(null);
    // The retry label is saved before the request in case it fails.
    setLastSearch(retryLabel);
    // This log helps learners follow the request lifecycle.
    console.log("[useWeatherDashboard] Weather request started", retryLabel);
    // try contains the awaited network operation that might fail.
    try {
      // The request function receives the new cancellation signal.
      const result = await requestFunction(controller.signal);
      // An aborted result must not update state after a newer request began.
      if (controller.signal.aborted) return undefined;
      // The current conditions and forecast are stored together.
      setWeatherData(result);
      // The exact successful location supports favourites, retry, and unit changes.
      setLastLocation(result.location);
      // Successful locations are added to recent history.
      rememberLocation(result.location);
      // The interface changes from loading to success.
      setStatus("success");
      // The result is returned so advanced callers may inspect it.
      return result;
    } catch (requestError) {
      // Cancellation is an expected control flow rather than a visible error.
      if (controller.signal.aborted) return undefined;
      // Technical details remain available to a developer in the console.
      console.error("[useWeatherDashboard] Weather request failed", requestError);
      // The service translates Axios details into a safe message.
      const message = getWeatherErrorMessage(requestError);
      // A non-empty message moves the interface into its recoverable error state.
      if (message) {
        // The user-friendly message is stored for StatusMessage.
        setError(message);
        // The named error state selects the correct interface branch.
        setStatus("error");
      }
      // undefined means no usable weather result completed.
      return undefined;
    } finally {
      // Only the controller that still owns the ref is allowed to clear it.
      if (activeWeatherController.current === controller) {
        // Clearing the ref signals that no main request is active.
        activeWeatherController.current = null;
      }
    }
  }, [rememberLocation]);

  // This callback performs the PDF's city → coordinates → forecast sequence.
  const searchCity = useCallback((city) => {
    // Removing outer spaces supports the PDF's additional-spaces test case.
    const cleanedCity = city.trim();
    // Empty searches are blocked before state or network activity changes.
    if (!cleanedCity) return Promise.resolve(undefined);
    // The API service receives the current unit and cancellation signal.
    return runWeatherRequest(
      (signal) => getCityWeather(cleanedCity, { signal, temperatureUnit }),
      cleanedCity,
    );
  }, [runWeatherRequest, temperatureUnit]);

  // This callback loads an exact suggestion, favourite, recent item, or browser location.
  const selectLocation = useCallback((location) => {
    // A readable label appears in retry feedback and console logs.
    const label = [location.name, location.region, location.country].filter(Boolean).join(", ");
    // Coordinates skip the unnecessary geocoding request.
    return runWeatherRequest(
      (signal) => getLocationWeather(location, { signal, temperatureUnit }),
      label,
    );
  }, [runWeatherRequest, temperatureUnit]);

  // This callback retrieves debounced city suggestions without changing the main interface state.
  const getSuggestions = useCallback(async (query) => {
    // A newer typed query makes the previous suggestion list obsolete.
    activeSuggestionController.current?.abort();
    // A fresh controller belongs to this suggestion request.
    const controller = new AbortController();
    // Saving it allows the next keystroke to cancel it.
    activeSuggestionController.current = controller;
    // try handles normal results and expected cancellation.
    try {
      // The service returns a normalized list of matching locations.
      return await searchLocations(query, { signal: controller.signal, count: 5 });
    } catch (suggestionError) {
      // Cancellation does not need an error message or console noise.
      if (controller.signal.aborted) return [];
      // A failed suggestion should not block manual form submission.
      console.error("[useWeatherDashboard] Suggestions failed", suggestionError);
      // An empty list simply hides the suggestion menu.
      return [];
    } finally {
      // Clear only the controller that still represents the latest query.
      if (activeSuggestionController.current === controller) activeSuggestionController.current = null;
    }
  }, []);

  // This callback retries the exact last successful or attempted location.
  const retrySearch = useCallback(() => {
    // Exact coordinates are preferred because they avoid city-name ambiguity.
    if (lastLocation) return selectLocation(lastLocation);
    // A failed first city search can still be repeated by its text.
    if (lastSearch) return searchCity(lastSearch);
    // No remembered request means there is nothing to retry.
    return Promise.resolve(undefined);
  }, [lastLocation, lastSearch, searchCity, selectLocation]);

  // This callback switches units and reloads current data in the new unit.
  const changeTemperatureUnit = useCallback((nextUnit) => {
    // Unexpected values are ignored to protect the API request.
    if (!["celsius", "fahrenheit"].includes(nextUnit)) return;
    // Store the preference immediately for future visits.
    setTemperatureUnit(nextUnit);
    // Persist the value in the visitor's browser.
    writeStoredValue("temperature-unit", nextUnit);
    // Existing weather is reloaded so every API-provided unit remains consistent.
    if (lastLocation) {
      // The request explicitly uses nextUnit because state updates are asynchronous.
      runWeatherRequest(
        (signal) => getLocationWeather(lastLocation, { signal, temperatureUnit: nextUnit }),
        lastSearch,
      );
    }
  }, [lastLocation, lastSearch, runWeatherRequest]);

  // This callback alternates between light and dark themes.
  const toggleTheme = useCallback(() => {
    // Functional state access guarantees the latest current theme.
    setTheme((currentTheme) => {
      // The opposite theme becomes the new value.
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      // The chosen theme is saved for the next visit.
      writeStoredValue("theme", nextTheme);
      // Returning it updates both React and the theme synchronization effect.
      return nextTheme;
    });
  }, []);

  // This callback adds or removes the currently selected location from favourites.
  const toggleFavourite = useCallback((location) => {
    // Functional access avoids using an outdated favourites array.
    setFavourites((currentFavourites) => {
      // The shared key determines whether the location is already saved.
      const alreadySaved = currentFavourites.some((item) => locationKey(item) === locationKey(location));
      // Existing locations are removed; new locations are placed first.
      const updatedFavourites = alreadySaved
        ? currentFavourites.filter((item) => locationKey(item) !== locationKey(location))
        : addUniqueLocation(currentFavourites, location);
      // The updated list is persisted immediately.
      writeStoredValue("favourites", updatedFavourites);
      // React receives the same list displayed to the visitor.
      return updatedFavourites;
    });
  }, []);

  // This callback requests browser geolocation and converts it into the app's location shape.
  const useCurrentLocation = useCallback(() => {
    // Browsers without geolocation receive an immediate helpful error.
    if (!navigator.geolocation) {
      // The error message is displayed by the shared status component.
      setError("This browser does not support location access.");
      // The request state changes to error.
      setStatus("error");
      // There is no asynchronous result to return.
      return;
    }
    // Loading starts while the browser asks the visitor for permission.
    setStatus("loading");
    // A previous message is cleared before the permission attempt.
    setError("");
    // getCurrentPosition runs one callback on success and another on failure.
    navigator.geolocation.getCurrentPosition(
      // This success callback receives the visitor-approved coordinates.
      (position) => {
        // A normal location object lets the existing selection function be reused.
        selectLocation({
          id: "current-location",
          name: "Current location",
          region: "",
          country: "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timezone: "auto",
        });
      },
      // This failure callback handles denial, timeout, and unavailable coordinates.
      (geolocationError) => {
        // Technical details remain in the console for debugging.
        console.error("[geolocation] Location request failed", geolocationError);
        // The visitor receives a concise recovery explanation.
        setError("Your location could not be accessed. Search for a city instead.");
        // The error branch becomes visible.
        setStatus("error");
      },
      // These options request a reasonably recent and accurate location without waiting forever.
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [selectLocation]);

  // This derived boolean identifies whether the current location is a favourite.
  const isCurrentFavourite = Boolean(
    lastLocation && favourites.some((item) => locationKey(item) === locationKey(lastLocation)),
  );

  // The returned object is the public interface used by WeatherDashboard and its children.
  return {
    changeTemperatureUnit,
    error,
    favourites,
    getSuggestions,
    isCurrentFavourite,
    lastLocation,
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
  };
}
