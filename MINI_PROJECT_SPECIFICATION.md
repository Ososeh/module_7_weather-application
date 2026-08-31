# Module 7 Mini-Project Specification

This document extracts and organises the complete mini-project section from the supplied **Module 7: Working with APIs in ReactJS** PDF. It also records which optional improvements were implemented.

## Required project

The PDF specifies a **Weather Application**. Its objective is to build a responsive application that lets a user search for a city and view current conditions plus a five-day forecast.

## Required technologies and concepts

- Open-Meteo Geocoding API
- Open-Meteo Weather Forecast API
- Axios
- React state
- Form events
- `async` and `await`
- Loading and error states
- Reusable components
- API service files

The geocoding service accepts a place name and returns matching locations with coordinates. The forecast service accepts latitude and longitude together with requested weather variables.

## Required features

- Search for a city.
- Prevent empty searches.
- Convert the city into coordinates.
- Retrieve current weather.
- Retrieve a five-day forecast.
- Display city and country.
- Display current temperature.
- Display apparent temperature.
- Display humidity.
- Display wind speed.
- Display the current condition.
- Display each day's minimum and maximum temperature.
- Show loading feedback.
- Show user-friendly errors.
- Show an initial welcome state.
- Allow another city to be searched.
- Work on desktop and mobile screens.

## Required request sequence

1. The user enters a city.
2. The application sends a geocoding request.
3. It receives a location result.
4. It reads the result's latitude and longitude.
5. It sends the weather forecast request.
6. It receives current and daily weather.
7. React displays the result.

The two requests are **dependent**, not parallel: geocoding must finish before the forecast request because the forecast request needs the returned coordinates.

## Suggested component structure from the PDF

```text
App
├── Header
├── SearchForm
├── StatusMessage
├── CurrentWeather
├── WeatherDetails
└── ForecastList
    └── ForecastCard
```

This completed version keeps all of those responsibilities and adds `WeatherDashboard` as the parent called by the deliberately small `App.jsx`. It also adds `HourlyForecast`, `SavedLocations`, and `LoadingSkeleton` for the optional improvements.

## Suggested source structure from the PDF

```text
src/
├── api/weatherApi.js
├── components/
│   ├── CurrentWeather.jsx
│   ├── ForecastCard.jsx
│   ├── ForecastList.jsx
│   ├── Header.jsx
│   ├── SearchForm.jsx
│   └── StatusMessage.jsx
├── utils/weatherCode.js
├── App.jsx
├── index.css
└── main.jsx
```

The completed project follows this separation and expands it with `hooks`, `styles`, `layout`, tests, and storage utilities.

## PDF implementation steps

1. Create a Vite project and choose React with JavaScript.
2. Install dependencies and Axios.
3. Create the API service.
4. Create the WMO weather-code utility.
5. Create the header.
6. Create the controlled search form.
7. Create a reusable status message.
8. Create the current-weather component.
9. Create the forecast card.
10. Create the forecast list.
11. Assemble application state and conditional rendering.
12. Connect the React entry file.
13. Add responsive styling.
14. Complete the testing checklist.

## PDF testing checklist

- Search for one valid city.
- Search for another valid city.
- Attempt an empty search.
- Search for an invalid city.
- Search with additional outer spaces.
- Disconnect the internet and search.
- Reconnect and use Retry.
- Confirm loading feedback appears.
- Confirm the search button is disabled during loading.
- Confirm current conditions appear.
- Confirm five forecast cards appear.
- Confirm the mobile layout works.
- Confirm units come from the API response.
- Confirm an old error disappears before a new request.
- Confirm an old result is cleared after a failed search.

## Optional improvements listed in the PDF

The PDF proposes Celsius/Fahrenheit switching, current-location weather, recent searches, favourite cities, local-storage persistence, hourly forecast, sunrise/sunset, precipitation probability, wind direction, dark mode, search suggestions, city-selection results, skeleton loaders, animated icons, weather backgrounds, last-updated information, offline feedback, request cancellation, debounced search, and accessibility improvements.

This completed version implements every listed improvement except separately animated weather artwork. It uses a reduced-motion-aware skeleton animation and static emoji conditions so motion-sensitive visitors are respected.

## Alternative project described after the weather project

The PDF permits a **Movie Search Application** instead of the Weather Application. Its features are title search, empty-search prevention, loading/error/no-result states, reusable movie cards, posters, release dates, ratings, details, pagination, and saved favourites. It warns that movie providers differ in endpoints, authentication, image paths, and limits. Private provider tokens must be protected behind a backend or serverless route rather than exposed in React.

The Weather Application was implemented because it is the PDF's primary mini-project. The Movie Search Application is an alternative, not an additional requirement.
