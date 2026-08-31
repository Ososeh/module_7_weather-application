// This prefix keeps the app's saved values separate from unrelated websites and projects.
const STORAGE_PREFIX = "module7-weather:";

// This helper reads and parses one saved value with a safe fallback.
export function readStoredValue(key, fallbackValue) {
  // Browser storage can fail in private mode, so risky work belongs inside try.
  try {
    // localStorage returns text or null for a missing key.
    const storedText = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    // A missing value returns the caller's supplied default.
    return storedText === null ? fallbackValue : JSON.parse(storedText);
  } catch (error) {
    // Developers can inspect the technical failure without disturbing the visitor.
    console.error(`[storage] Could not read ${key}`, error);
    // The app remains usable with its normal default.
    return fallbackValue;
  }
}

// This helper converts and saves one value in browser storage.
export function writeStoredValue(key, value) {
  // Storage writes may fail if space or permission is unavailable.
  try {
    // JSON.stringify converts arrays, objects, booleans, and text into storable text.
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    // This log helps learners observe when persistence occurs.
    console.log(`[storage] Saved ${key}`, value);
  } catch (error) {
    // A failed preference save should be reported but should not crash weather search.
    console.error(`[storage] Could not save ${key}`, error);
  }
}
