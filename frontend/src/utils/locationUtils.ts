/**
 * Reverse geocoding utility to get address details from coordinates
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

export interface ReverseGeocodeResult {
  longitude: number;
  latitude: number;
  zip?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  freeFormAddress?: string;
}

/**
 * Reverse geocode coordinates to get full address details
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    // Request English language results using accept-language header
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EnterpriseAttendanceApp/1.0', // Required by Nominatim
          'Accept-Language': 'en', // Request English language results
        },
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    const address = data.address || {};

    // Extract address components
    const result: ReverseGeocodeResult = {
      longitude,
      latitude,
      zip: address.postcode || undefined,
      countryCode: address.country_code?.toUpperCase() || undefined,
      state: address.state || address.region || undefined,
      city: address.city || address.town || address.village || address.county || undefined,
      addressLine1: address.road || address.house_number 
        ? `${address.house_number || ''} ${address.road || ''}`.trim() 
        : address.suburb || address.neighbourhood || undefined,
      addressLine2: address.suburb || address.neighbourhood || address.district || undefined,
      freeFormAddress: data.display_name || undefined,
    };

    return result;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return basic structure with just coordinates if geocoding fails
    return {
      longitude,
      latitude,
    };
  }
}

/**
 * Get current location with full address details
 */
export async function getCurrentLocationWithAddress(): Promise<ReverseGeocodeResult | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(address);
        } catch (error) {
          console.error('Failed to get address:', error);
          // Return basic location if reverse geocoding fails
          resolve({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        }
      },
      (error) => {
        console.warn('Location access denied or unavailable:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

