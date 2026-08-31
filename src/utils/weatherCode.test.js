// Vitest supplies the functions required to define and evaluate utility tests.
import { expect, test } from "vitest";
// These are the real utility functions used by current, hourly, and daily components.
import { getWeatherDescription, getWindDirection } from "./weatherCode.js";

// This test verifies representative WMO code mappings from the PDF.
test("maps weather codes to readable conditions", () => {
  // Code zero must become the required clear-sky description.
  expect(getWeatherDescription(0).label).toBe("Clear sky");
  // Code 63 is one of the rain conditions.
  expect(getWeatherDescription(63).label).toBe("Rain");
  // An unknown future code must return a safe fallback.
  expect(getWeatherDescription(12345).label).toBe("Unknown conditions");
});

// This test verifies the optional compass-direction calculation.
test("converts wind degrees to compass directions", () => {
  // Zero degrees points north.
  expect(getWindDirection(0)).toBe("N");
  // Ninety degrees points east.
  expect(getWindDirection(90)).toBe("E");
  // Two hundred and twenty-five degrees points southwest.
  expect(getWindDirection(225)).toBe("SW");
});
