import BusinessUnit from '../models/BusinessUnit.ts';
import { NotFoundError, ConflictError } from '../utils/errors.ts';

class BusinessUnitService {
  // Create new business unit
  async createBusinessUnit(data: any) {
    const businessUnit = await BusinessUnit.create(data);
    const businessUnitObj = businessUnit.toObject();
    // Transform _id to id for frontend compatibility
    if (businessUnitObj._id) {
      businessUnitObj.id = businessUnitObj._id.toString();
    }
    return businessUnitObj;
  }

  // Get all business units
  async getAllBusinessUnits(filters: any = {}) {
    const query: any = {};

    // Optional search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const businessUnits = await BusinessUnit.find(query).sort({ name: 1 });
    
    // Transform _id to id for frontend compatibility
    return businessUnits.map((bu: any) => {
      const buObj = bu.toObject();
      if (buObj._id) {
        buObj.id = buObj._id.toString();
      }
      return buObj;
    });
  }

  // Get business unit by ID
  async getBusinessUnitById(id: string) {
    const businessUnit = await BusinessUnit.findById(id);

    if (!businessUnit) {
      throw new NotFoundError('Business unit not found');
    }

    const businessUnitObj = businessUnit.toObject();
    // Transform _id to id for frontend compatibility
    if (businessUnitObj._id) {
      businessUnitObj.id = businessUnitObj._id.toString();
    }
    return businessUnitObj;
  }

  // Update business unit
  async updateBusinessUnit(id: string, data: any) {
    const businessUnit = await BusinessUnit.findById(id);

    if (!businessUnit) {
      throw new NotFoundError('Business unit not found');
    }

    Object.assign(businessUnit, data);
    await businessUnit.save();
    const businessUnitObj = businessUnit.toObject();
    // Transform _id to id for frontend compatibility
    if (businessUnitObj._id) {
      businessUnitObj.id = businessUnitObj._id.toString();
    }
    return businessUnitObj;
  }

  // Delete business unit
  async deleteBusinessUnit(id: string) {
    const businessUnit = await BusinessUnit.findById(id);

    if (!businessUnit) {
      throw new NotFoundError('Business unit not found');
    }

    await businessUnit.deleteOne();
    return { message: 'Business unit deleted successfully' };
  }
}

export default new BusinessUnitService();

