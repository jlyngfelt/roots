import { Coordinates } from "../interfaces/index"

export const getCoordinates = async (postalCode: string): Promise<Coordinates | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=Sweden&format=json`,
      {
        headers: {
          'User-Agent': 'MinApp/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};