import Location from '../models/Location.ts';
import { NotFoundError } from '../utils/errors.ts';

class LocationService {
  // Create new location
  async createLocation(data: any) {
    const location = await Location.create(data);
    const locationObj = location.toObject();
    // Transform _id to id for frontend compatibility
    if (locationObj._id) {
      locationObj.id = locationObj._id.toString();
    }
    return locationObj;
  }

  // Get all locations
  async getAllLocations(filters: any = {}) {
    const query: any = {};

    // Optional search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } },
        { state: { $regex: filters.search, $options: 'i' } },
        { country: { $regex: filters.search, $options: 'i' } },
        { address: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const locations = await Location.find(query).sort({ name: 1 });
    
    // Transform _id to id for frontend compatibility
    return locations.map((loc: any) => {
      const locObj = loc.toObject();
      if (locObj._id) {
        locObj.id = locObj._id.toString();
      }
      return locObj;
    });
  }

  // Get location by ID
  async getLocationById(id: string) {
    const location = await Location.findById(id);

    if (!location) {
      throw new NotFoundError('Location not found');
    }

    const locationObj = location.toObject();
    // Transform _id to id for frontend compatibility
    if (locationObj._id) {
      locationObj.id = locationObj._id.toString();
    }
    return locationObj;
  }

  // Update location
  async updateLocation(id: string, data: any) {
    const location = await Location.findById(id);

    if (!location) {
      throw new NotFoundError('Location not found');
    }

    Object.assign(location, data);
    await location.save();
    const locationObj = location.toObject();
    // Transform _id to id for frontend compatibility
    if (locationObj._id) {
      locationObj.id = locationObj._id.toString();
    }
    return locationObj;
  }

  // Delete location
  async deleteLocation(id: string) {
    const location = await Location.findById(id);

    if (!location) {
      throw new NotFoundError('Location not found');
    }

    await location.deleteOne();
    return { message: 'Location deleted successfully' };
  }
}

export default new LocationService();






