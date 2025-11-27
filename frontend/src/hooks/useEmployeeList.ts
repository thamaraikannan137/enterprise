import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import type { Employee } from '../types/employee';

interface UseEmployeeListOptions {
  status?: 'active' | 'inactive' | 'terminated';
  limit?: number;
  excludeId?: string; // Exclude specific employee ID (for self-reference prevention)
}

export const useEmployeeList = (options: UseEmployeeListOptions = {}) => {
  const { status = 'active', limit = 100, excludeId } = options;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await employeeService.getEmployees({
          status,
          limit,
        });
        
        // Filter out excluded employee if provided
        let filteredEmployees = response.employees;
        if (excludeId) {
          filteredEmployees = response.employees.filter(emp => emp.id !== excludeId);
        }
        
        setEmployees(filteredEmployees);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [status, limit, excludeId]);

  return { employees, loading, error };
};


