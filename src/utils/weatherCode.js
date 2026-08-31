// This frozen lookup converts WMO weather codes into readable interface details.
const weatherGroups = Object.freeze([
  // Code zero represents a completely clear sky.
  { codes: [0], label: "Clear sky", icon: "☀️", theme: "clear" },
  // Codes one and two represent mainly clear or partly cloudy conditions.
  { codes: [1, 2], label: "Partly cloudy", icon: "⛅", theme: "cloudy" },
  // Code three represents an overcast sky.
  { codes: [3], label: "Overcast", icon: "☁️", theme: "cloudy" },
  // Codes 45 and 48 represent fog conditions.
  { codes: [45, 48], label: "Fog", icon: "🌫️", theme: "fog" },
  // These codes cover several forms of drizzle.
  { codes: [51, 53, 55, 56, 57], label: "Drizzle", icon: "🌦️", theme: "rain" },
  // These codes cover rain and rain showers.
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: "Rain", icon: "🌧️", theme: "rain" },
  // These codes cover snowfall, snow grains, and snow showers.
  { codes: [71, 73, 75, 77, 85, 86], label: "Snow", icon: "❄️", theme: "snow" },
  // These codes cover thunderstorms with or without hail.
  { codes: [95, 96, 99], label: "Thunderstorm", icon: "⛈️", theme: "storm" },
]);

// This function returns a safe description for any numeric weather code.
export function getWeatherDescription(code) {
  // find selects the first group whose code list includes the supplied value.
  const match = weatherGroups.find((group) => group.codes.includes(Number(code)));
  // The fallback keeps unknown future API codes from breaking the interface.
  return match ?? { label: "Unknown conditions", icon: "🌍", theme: "default" };
}

// This function converts degrees into the nearest named compass direction.
export function getWindDirection(degrees) {
  // These labels divide a full circle into eight familiar directions.
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  // Normalizing handles negative values and values larger than 360 safely.
  const normalizedDegrees = ((Number(degrees) % 360) + 360) % 360;
  // Dividing by 45 finds the nearest one of the eight direction labels.
  const directionIndex = Math.round(normalizedDegrees / 45) % directions.length;
  // The selected label is returned for display beside wind speed.
  return directions[directionIndex];
}

// This function safely formats API times for the current visitor's locale.
export function formatWeatherTime(value, options = {}) {
  // An absent time becomes a clear placeholder instead of an invalid date.
  if (!value) return "Unavailable";
  // The Date object converts the API's ISO-style text into a date-time value.
  const date = new Date(value);
  // An invalid date is handled without throwing an error.
  if (Number.isNaN(date.getTime())) return "Unavailable";
  // toLocaleString uses familiar date and time formatting on the learner's device.
  return date.toLocaleString(undefined, options);
}
