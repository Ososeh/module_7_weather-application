// This component presents reusable recent-search and favourite-location buttons.
function SavedLocations({ favourites, onSelect, recentSearches }) {
  // No section is needed until at least one saved location exists.
  if (recentSearches.length === 0 && favourites.length === 0) return null;

  // This helper creates one compact row without duplicating JSX.
  function renderLocationGroup(title, locations) {
    // Empty groups are omitted to avoid unexplained headings.
    if (locations.length === 0) return null;
    // Each location button starts an exact coordinate request.
    return (
      <div className="saved-group">
        <h2>{title}</h2>
        <div className="saved-list">
          {locations.map((location) => (
            <button
              key={`${location.latitude}:${location.longitude}`}
              type="button"
              onClick={() => onSelect(location)}
            >
              {location.name}{location.country ? `, ${location.country}` : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // The returned JSX places both optional persistence features in one section.
  return (
    <section className="saved-locations" aria-label="Saved locations">
      {renderLocationGroup("Recent", recentSearches)}
      {renderLocationGroup("Favourites", favourites)}
    </section>
  );
}

// This export allows WeatherDashboard to show persisted locations.
export default SavedLocations;
