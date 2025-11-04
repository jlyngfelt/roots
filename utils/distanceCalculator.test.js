import { calculateDistance } from "./distanceCalculator";

describe("calculateDistance", () => {
  test("calculates distance between Stockholm and Gothenburg", () => {
    const stockholmLat = 59.3293;
    const stockholmLon = 18.0686;
    const gothenburgLat = 57.7089;
    const gothenburgLon = 11.9746;

    const distance = calculateDistance(
      stockholmLat,
      stockholmLon,
      gothenburgLat,
      gothenburgLon
    );

    expect(distance).toBeGreaterThan(395);
    expect(distance).toBeLessThan(400);
  });

  test("returns 0 when comparing the same location", () => {
    const lat = 59.3293;
    const lon = 18.0686;

    const distance = calculateDistance(lat, lon, lat, lon);

    expect(distance).toBe(0);
  });

  test("calculates distance for nearby locations (under 10 km)", () => {
    const lat1 = 59.3293;
    const lon1 = 18.0686;
    const lat2 = 59.35;
    const lon2 = 18.0686;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    expect(distance).toBeGreaterThan(2);
    expect(distance).toBeLessThan(3);
  });
});
