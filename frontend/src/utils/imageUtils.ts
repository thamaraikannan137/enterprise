import { API_BASE_URL } from '../config/constants';

/**
 * Converts a relative image path to a full URL
 * @param imagePath - Relative path like "uploads/profile-photos/image.jpg"
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath?: string | null): string | undefined => {
  if (!imagePath) {
    return undefined;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // Construct full URL
  // API_BASE_URL might be like "http://localhost:3000/api" or "http://localhost:3000"
  let baseUrl = API_BASE_URL;
  
  // Remove /api suffix if present to get the base server URL
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }
  
  // Also remove /v1 if present
  if (baseUrl.endsWith('/v1')) {
    baseUrl = baseUrl.slice(0, -3);
  }
  
  // Ensure baseUrl doesn't end with a slash
  baseUrl = baseUrl.replace(/\/$/, '');
  
  const fullUrl = `${baseUrl}/${cleanPath}`;
  // Removed console.log to prevent excessive logging
  return fullUrl;
};

