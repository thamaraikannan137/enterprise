import LegalEntity from '../models/LegalEntity.ts';
import { NotFoundError } from '../utils/errors.ts';

class LegalEntityService {
  // Create new legal entity
  async createLegalEntity(data: any) {
    // Convert date_of_incorporation string to Date if provided
    if (data.date_of_incorporation && typeof data.date_of_incorporation === 'string') {
      data.date_of_incorporation = new Date(data.date_of_incorporation);
    }

    const legalEntity = await LegalEntity.create(data);
    const legalEntityObj = legalEntity.toObject();
    // Transform _id to id for frontend compatibility
    if (legalEntityObj._id) {
      legalEntityObj.id = legalEntityObj._id.toString();
    }
    return legalEntityObj;
  }

  // Get all legal entities
  async getAllLegalEntities(filters: any = {}) {
    const query: any = {};

    // Optional search filter
    if (filters.search) {
      query.$or = [
        { entity_name: { $regex: filters.search, $options: 'i' } },
        { legal_name: { $regex: filters.search, $options: 'i' } },
        { company_identification_number: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } },
        { state: { $regex: filters.search, $options: 'i' } },
        { country: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const legalEntities = await LegalEntity.find(query).sort({ entity_name: 1 });
    
    // Transform _id to id for frontend compatibility
    return legalEntities.map((entity: any) => {
      const entityObj = entity.toObject();
      if (entityObj._id) {
        entityObj.id = entityObj._id.toString();
      }
      return entityObj;
    });
  }

  // Get legal entity by ID
  async getLegalEntityById(id: string) {
    const legalEntity = await LegalEntity.findById(id);

    if (!legalEntity) {
      throw new NotFoundError('Legal entity not found');
    }

    const legalEntityObj = legalEntity.toObject();
    // Transform _id to id for frontend compatibility
    if (legalEntityObj._id) {
      legalEntityObj.id = legalEntityObj._id.toString();
    }
    return legalEntityObj;
  }

  // Update legal entity
  async updateLegalEntity(id: string, data: any) {
    const legalEntity = await LegalEntity.findById(id);

    if (!legalEntity) {
      throw new NotFoundError('Legal entity not found');
    }

    // Convert date_of_incorporation string to Date if provided
    if (data.date_of_incorporation && typeof data.date_of_incorporation === 'string') {
      data.date_of_incorporation = new Date(data.date_of_incorporation);
    }

    Object.assign(legalEntity, data);
    await legalEntity.save();
    const legalEntityObj = legalEntity.toObject();
    // Transform _id to id for frontend compatibility
    if (legalEntityObj._id) {
      legalEntityObj.id = legalEntityObj._id.toString();
    }
    return legalEntityObj;
  }

  // Delete legal entity
  async deleteLegalEntity(id: string) {
    const legalEntity = await LegalEntity.findById(id);

    if (!legalEntity) {
      throw new NotFoundError('Legal entity not found');
    }

    await legalEntity.deleteOne();
    return { message: 'Legal entity deleted successfully' };
  }
}

export default new LegalEntityService();




