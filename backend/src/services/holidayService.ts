import HolidayCalendar from '../models/HolidayCalendar.ts';
import { NotFoundError } from '../utils/errors.ts';

interface CreateHolidayData {
  date: Date;
  name: string;
  type: 'National' | 'Regional' | 'Company';
  isActive?: boolean;
  locationId?: string;
  created_by?: string;
}

class HolidayService {
  async createHoliday(data: CreateHolidayData) {
    const holiday = await HolidayCalendar.create(data);
    return holiday.toObject();
  }

  async getHolidays(filters?: { year?: number; locationId?: string; isActive?: boolean }) {
    const query: any = {};

    if (filters?.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year, 11, 31, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (filters?.locationId) {
      query.locationId = filters.locationId;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const holidays = await HolidayCalendar.find(query).sort({ date: 1 });
    // Convert to plain objects and ensure id field exists
    return holidays.map((holiday) => {
      const holidayObj = holiday.toObject();
      // Ensure id field is set (toJSON transform should handle this, but just in case)
      if (!holidayObj.id && holidayObj._id) {
        holidayObj.id = holidayObj._id.toString();
      }
      return holidayObj;
    });
  }

  async getHolidayById(id: string) {
    const holiday = await HolidayCalendar.findById(id);
    if (!holiday) {
      throw new NotFoundError('Holiday not found');
    }
    const holidayObj = holiday.toObject();
    // Ensure id field is set
    if (!holidayObj.id && holidayObj._id) {
      holidayObj.id = holidayObj._id.toString();
    }
    return holidayObj;
  }

  async updateHoliday(id: string, data: Partial<CreateHolidayData>) {
    const holiday = await HolidayCalendar.findById(id);
    if (!holiday) {
      throw new NotFoundError('Holiday not found');
    }

    // Update only provided fields
    if (data.date !== undefined) holiday.date = data.date;
    if (data.name !== undefined) holiday.name = data.name;
    if (data.type !== undefined) holiday.type = data.type;
    if (data.isActive !== undefined) holiday.isActive = data.isActive;
    if (data.locationId !== undefined) holiday.locationId = data.locationId as any;

    await holiday.save();
    const holidayObj = holiday.toObject();
    // Ensure id field is set
    if (!holidayObj.id && holidayObj._id) {
      holidayObj.id = holidayObj._id.toString();
    }
    return holidayObj;
  }

  async deleteHoliday(id: string) {
    const holiday = await HolidayCalendar.findByIdAndDelete(id);
    if (!holiday) {
      throw new NotFoundError('Holiday not found');
    }
    return { message: 'Holiday deleted successfully' };
  }

  async isHoliday(date: Date, locationId?: string) {
    const query: any = {
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      isActive: true,
    };

    if (locationId) {
      query.$or = [{ locationId }, { locationId: null }];
    } else {
      query.locationId = null;
    }

    const holiday = await HolidayCalendar.findOne(query);
    if (!holiday) {
      return null;
    }
    const holidayObj = holiday.toObject();
    // Ensure id field is set
    if (!holidayObj.id && holidayObj._id) {
      holidayObj.id = holidayObj._id.toString();
    }
    return holidayObj;
  }
}

export default new HolidayService();

