// This reusable component displays initial, loading, offline, and error feedback.
function StatusMessage({ actionLabel = "Try again", message, onAction, title, type = "info" }) {
  // Error messages use alert so assistive technology announces them urgently.
  const role = type === "error" || type === "offline" ? "alert" : "status";
  // The returned JSX builds one consistent feedback panel.
  return (
    <section className={`status-message ${type}`} role={role} aria-live={role === "alert" ? "assertive" : "polite"}>
      {/* The icon gives a quick non-text cue while the title keeps meaning explicit. */}
      <span className="status-icon" aria-hidden="true">
        {type === "error" ? "⚠️" : type === "loading" ? "⏳" : type === "offline" ? "📡" : "🌤️"}
      </span>
      <h2>{title}</h2>
      <p>{message}</p>
      {/* The action appears only when the parent supplies a recovery callback. */}
      {onAction && <button className="primary-button" type="button" onClick={onAction}>{actionLabel}</button>}
    </section>
  );
}

// This export allows all interface states to share one component.
export default StatusMessage;
