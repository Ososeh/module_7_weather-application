# Module 7 Weather Application

This standard Vite + React JavaScript project completes the Weather Application mini-project from **Module 7: Working with APIs in ReactJS** and implements nearly all of its optional improvements.

## Run it on your computer

```bash
npm install
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`.

The command is Windows-friendly: it contains no Linux-only environment-variable prefix and no deployment-specific Wrangler command.

## Quality commands

```bash
npm run lint
npm test
npm run build
```

## Project structure

```text
module-7-weather-application/
├── MINI_PROJECT_SPECIFICATION.md    Extracted PDF requirements and checklist
├── README.md                        Setup and architecture guide
├── index.html                       Browser document containing React's root
├── package.json                     Dependencies and development commands
├── vite.config.js                   Vite and automated-test configuration
├── eslint.config.js                 JavaScript and React safety rules
└── src/
    ├── api/
    │   └── weatherApi.js            Geocoding, forecast, validation, cancellation, errors
    ├── components/
    │   ├── layout/
    │   │   └── WeatherDashboard.jsx Parent component called by App.jsx
    │   ├── CurrentWeather.jsx       City, temperature, condition, favourite action
    │   ├── ForecastCard.jsx         One forecast day
    │   ├── ForecastList.jsx         Five forecast cards
    │   ├── Header.jsx               Title, unit control, dark-mode control
    │   ├── HourlyForecast.jsx       Next twelve hourly records
    │   ├── LoadingSkeleton.jsx      Visual loading feedback
    │   ├── SavedLocations.jsx       Recent and favourite buttons
    │   ├── SearchForm.jsx           Controlled input, debounce, suggestions, location
    │   ├── StatusMessage.jsx        Welcome, offline, and error feedback
    │   └── WeatherDetails.jsx       Humidity, wind, rain, sunrise, sunset, timezone
    ├── hooks/
    │   ├── useOnlineStatus.js       Browser online/offline events
    │   └── useWeatherDashboard.js   State and complete request workflow
    ├── styles/
    │   └── index.css                Responsive themes and accessibility styles
    ├── test/
    │   └── setup.js                 Test matchers
    ├── utils/
    │   ├── storage.js               Safe local persistence helpers
    │   ├── weatherCode.js           WMO descriptions, time, and wind direction
    │   └── weatherCode.test.js      Utility tests
    ├── App.jsx                      Minimal file calling only the parent component
    ├── App.test.jsx                 Initial-interface tests
    └── main.jsx                     React entry point
```

## How the request workflow operates

`SearchForm` sends cleaned city text to `useWeatherDashboard`. The Hook calls `getCityWeather` in `weatherApi.js`. That service first awaits `searchLocation`, reads the location's coordinates, and then awaits `getWeather`. The Hook stores the completed location and weather object. `WeatherDashboard` then displays `CurrentWeather`, `HourlyForecast`, and `ForecastList`.

If a new request starts, the earlier `AbortController` cancels its obsolete request. The interface always has one named state: `initial`, `loading`, `success`, or `error`.

## Important learning notes

- Open-Meteo does not require a private API key for this use case.
- Axios automatically parses the JSON body into `response.data`.
- The service supplies units and the components display those returned units rather than guessing.
- Recent searches, favourites, theme, and unit preferences are saved only in the current browser's local storage.
- Location access occurs only after the visitor presses **Use my location** and grants browser permission.
- Search suggestions wait 350 milliseconds after typing and cancel obsolete requests.

See `MINI_PROJECT_SPECIFICATION.md` for the complete extracted requirements, testing checklist, optional enhancements, and alternative-project information.

## Current-location correction

The **Use my location** action now follows this sequence:

1. Ask the browser for the user's current coordinates with `navigator.geolocation.getCurrentPosition()`.
2. Reverse-geocode those exact coordinates through BigDataCloud's free client-side reverse-geocoding endpoint.
3. Use the returned city/locality, region, and country as the displayed location.
4. Request weather directly from Open-Meteo using the same latitude and longitude.

This avoids the previous misleading `Current location` placeholder. The reverse-geocoding service is intended for real-time client-side coordinates obtained with user consent; review its fair-use policy before production use.

The homepage weather-API attribution footer was also removed as requested. The existing search, forecast, saved locations, theme, unit selection, loading/error handling, and responsive UI were otherwise preserved.
