import { afterEach, describe, expect, test, vi } from "vitest";

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: () => ({ get: mockGet }),
    isCancel: () => false,
  },
}));

import { reverseGeocodeCurrentLocation } from "./weatherApi";

afterEach(() => {
  mockGet.mockReset();
});

describe("reverseGeocodeCurrentLocation", () => {
  test("normalizes the city returned for live coordinates", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        city: "Abuja",
        locality: "Wuse",
        principalSubdivision: "Federal Capital Territory",
        countryName: "Nigeria",
        timeZone: "Africa/Lagos",
      },
    });

    const location = await reverseGeocodeCurrentLocation(9.0765, 7.3986);

    expect(location).toMatchObject({
      name: "Abuja",
      region: "Federal Capital Territory",
      country: "Nigeria",
      latitude: 9.0765,
      longitude: 7.3986,
    });
    expect(mockGet).toHaveBeenCalledWith(
      "https://api.bigdatacloud.net/data/reverse-geocode-client",
      expect.objectContaining({
        params: {
          latitude: 9.0765,
          longitude: 7.3986,
          localityLanguage: "en",
        },
      }),
    );
  });

  test("rejects invalid coordinates before a request", async () => {
    await expect(reverseGeocodeCurrentLocation("not-a-latitude", 7.3986)).rejects.toThrow(
      "Valid current-location coordinates are required.",
    );
    expect(mockGet).not.toHaveBeenCalled();
  });
});
