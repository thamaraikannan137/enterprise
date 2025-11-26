import AuditLog from '../models/AuditLog.ts';

export const auditService = {
  // Create audit log entry
  async createAuditLog(data: {
    table_name: string;
    record_id: string;
    action: 'insert' | 'update' | 'delete';
    old_values?: object;
    new_values?: object;
    changed_by: string;
  }) {
    return await AuditLog.create(data);
  },

  // Get audit logs with filters
  async getAuditLogs(filters: any = {}) {
    const { page = 1, limit = 50, table_name, record_id, action, changed_by, start_date, end_date } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query: any = {};

    if (table_name) {
      query.table_name = table_name;
    }

    if (record_id) {
      query.record_id = record_id;
    }

    if (action) {
      query.action = action;
    }

    if (changed_by) {
      query.changed_by = changed_by;
    }

    if (start_date || end_date) {
      query.changed_at = {};
      if (start_date) {
        query.changed_at.$gte = new Date(start_date);
      }
      if (end_date) {
        query.changed_at.$lte = new Date(end_date);
      }
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('changed_by', 'firstName lastName email')
        .sort({ changed_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  },

  // Get audit logs for a specific record
  async getRecordAuditHistory(tableName: string, recordId: string) {
    return await AuditLog.find({
      table_name: tableName,
      record_id: recordId,
    })
      .populate('changed_by', 'firstName lastName email')
      .sort({ changed_at: -1 });
  },

  // Get audit logs by user
  async getUserAuditLogs(userId: string, filters: any = {}) {
    const { page = 1, limit = 50, start_date, end_date } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query: any = { changed_by: userId };

    if (start_date || end_date) {
      query.changed_at = {};
      if (start_date) {
        query.changed_at.$gte = new Date(start_date);
      }
      if (end_date) {
        query.changed_at.$lte = new Date(end_date);
      }
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('changed_by', 'firstName lastName email')
        .sort({ changed_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  },
};
