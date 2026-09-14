import { readFile } from "node:fs/promises";

const app = await readFile("src/App.jsx", "utf8");
const dashboard = await readFile("src/components/layout/WeatherDashboard.jsx", "utf8");
const hook = await readFile("src/hooks/useWeatherDashboard.js", "utf8");
const api = await readFile("src/api/weatherApi.js", "utf8");

if (app.split("\n").length > 20) throw new Error("App.jsx should remain minimal.");
if (dashboard.includes("Weather data provided by Open-Meteo")) throw new Error("Weather API attribution footer still exists.");
for (const token of ["navigator.geolocation.getCurrentPosition", "reverseGeocodeCurrentLocation", "getLocationWeather"]) {
  if (!hook.includes(token)) throw new Error(`Current-location flow is missing: ${token}`);
}
if (!api.includes("api.bigdatacloud.net/data/reverse-geocode-client")) throw new Error("Reverse geocoding endpoint is missing.");
if (!api.includes("return {\n    id: `current-")) throw new Error("Reverse geocoding does not return a normalized current location.");

console.log("PASS: Module 7 minimal App, current-location reverse geocoding, exact-coordinate weather flow, and footer-removal checks passed.");
