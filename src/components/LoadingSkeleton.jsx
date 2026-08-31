// This component provides optional skeleton feedback while both API requests complete.
function LoadingSkeleton() {
  // The returned shapes approximate the final card without pretending to be real content.
  return (
    <section className="weather-skeleton" aria-hidden="true">
      {/* The animation follows the same overall hierarchy as CurrentWeather. */}
      <div className="skeleton-line short" />
      <div className="skeleton-line title" />
      <div className="skeleton-temperature" />
      <div className="skeleton-grid">
        <div />
        <div />
        <div />
      </div>
    </section>
  );
}

// This export allows the dashboard to show the skeleton during loading.
export default LoadingSkeleton;
