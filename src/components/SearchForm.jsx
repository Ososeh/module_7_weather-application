// React Hooks store controlled input, suggestions, and the debounce timer lifecycle.
import { useEffect, useId, useState } from "react";

// This component accepts callbacks instead of containing API endpoint details.
function SearchForm({ getSuggestions, isLoading, onLocationSearch, onSearch, onUseCurrentLocation }) {
  // city stores exactly what the visitor currently typed.
  const [city, setCity] = useState("");
  // suggestions stores normalized places returned by the geocoding service.
  const [suggestions, setSuggestions] = useState([]);
  // isSuggesting distinguishes a quiet empty list from an active suggestion request.
  const [isSuggesting, setIsSuggesting] = useState(false);
  // A generated id connects the input to its suggestion list for assistive technology.
  const suggestionListId = useId();

  // This handler updates the controlled input and immediately removes results from an older query.
  function handleCityChange(event) {
    // The latest typed text becomes the input's React state.
    setCity(event.target.value);
    // Old suggestions disappear while the debounce waits for matching new results.
    setSuggestions([]);
  }

  // This effect provides a 350-millisecond debounce before requesting suggestions.
  useEffect(() => {
    // Trimming prevents spaces from counting as useful search letters.
    const cleanedCity = city.trim();
    // Very short values hide suggestions and do not contact the API.
    if (cleanedCity.length < 2) {
      // No synchronous state update is needed because old suggestions are hidden by the JSX condition.
      return undefined;
    }
    // The timer delays work until typing pauses briefly.
    const timerId = window.setTimeout(async () => {
      // The loading message helps a learner observe the suggestion request.
      setIsSuggesting(true);
      // The Hook cancels any older suggestion request and returns the newest matches.
      const matches = await getSuggestions(cleanedCity);
      // The results update the accessible selection list.
      setSuggestions(matches);
      // The suggestion request has now finished.
      setIsSuggesting(false);
    }, 350);
    // Cleanup cancels the timer whenever the value changes before 350 milliseconds.
    return () => window.clearTimeout(timerId);
  }, [city, getSuggestions]);

  // This handler validates and submits the controlled city value.
  function handleSubmit(event) {
    // Preventing normal submission keeps React on the current page.
    event.preventDefault();
    // Outer spaces are removed before validation and API use.
    const cleanedCity = city.trim();
    // Empty searches are blocked even if the handler is triggered programmatically.
    if (!cleanedCity) return;
    // Suggestions close when the visitor deliberately submits the search.
    setSuggestions([]);
    // The parent Hook begins the dependent geocoding and forecast requests.
    onSearch(cleanedCity);
  }

  // This handler chooses an exact place from the suggestion results.
  function handleSuggestionClick(location) {
    // A contextual label replaces the visitor's partial query.
    setCity([location.name, location.region, location.country].filter(Boolean).join(", "));
    // The menu closes after selection.
    setSuggestions([]);
    // Exact coordinates avoid another geocoding request.
    onLocationSearch(location);
  }

  // Cleaned text is derived during render because it does not require separate state.
  const cleanedCity = city.trim();
  // Suggestions remain visually hidden until the input contains a useful query.
  const showSuggestions = cleanedCity.length >= 2 && (isSuggesting || suggestions.length > 0);

  // The returned JSX builds the complete search area.
  return (
    <form className="search-form" onSubmit={handleSubmit}>
      {/* The visible label gives the text field an accessible name. */}
      <label htmlFor="city-search">Search for a city</label>
      {/* This row keeps search and geolocation actions together. */}
      <div className="search-group">
        {/* This wrapper positions the suggestion panel below its input. */}
        <div className="search-input-wrapper">
          <input
            id="city-search"
            type="search"
            value={city}
            onChange={handleCityChange}
            placeholder="Example: Abuja"
            autoComplete="off"
            disabled={isLoading}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? suggestionListId : undefined}
            aria-expanded={showSuggestions}
          />
          {/* The panel includes progress or selectable place matches. */}
          {showSuggestions && (
            <div className="suggestion-panel" id={suggestionListId} role="listbox">
              {/* A status message appears while the debounce request is active. */}
              {isSuggesting && <p role="status">Finding matching places…</p>}
              {/* Each normalized location becomes a real keyboard-accessible button. */}
              {!isSuggesting && suggestions.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => handleSuggestionClick(location)}
                >
                  <strong>{location.name}</strong>
                  <span>{[location.region, location.country].filter(Boolean).join(", ")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Disabled state prevents empty and duplicate submissions. */}
        <button className="primary-button" type="submit" disabled={isLoading || cleanedCity === ""}>
          {isLoading ? "Searching…" : "Search"}
        </button>
        {/* Browser geolocation is optional and always requires the visitor's permission. */}
        <button className="secondary-button" type="button" onClick={onUseCurrentLocation} disabled={isLoading}>
          ◎ Use my location
        </button>
      </div>
    </form>
  );
}

// This export allows the parent dashboard to reuse the form.
export default SearchForm;
