import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Employee,
  EmployeeWithDetails,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilters,
  EmployeeListResponse,
} from '../../types/employee';
import { employeeService } from '../../services/employeeService';

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | EmployeeWithDetails | null;
  filters: EmployeeFilters;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  filters: {
    page: 1,
    limit: 10,
  },
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (filters?: EmployeeFilters) => {
    const response = await employeeService.getEmployees(filters);
    return response;
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchEmployeeById',
  async (employeeId: string) => {
    const response = await employeeService.getEmployeeById(employeeId);
    return response;
  }
);

export const fetchEmployeeWithDetails = createAsyncThunk(
  'employee/fetchEmployeeWithDetails',
  async (employeeId: string) => {
    const response = await employeeService.getEmployeeWithDetails(employeeId);
    return response;
  }
);

export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (employeeData: CreateEmployeeInput) => {
    const response = await employeeService.createEmployee(employeeData);
    return response;
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({ id, data }: { id: string; data: UpdateEmployeeInput }) => {
    const response = await employeeService.updateEmployee(id, data);
    return response;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (employeeId: string) => {
    await employeeService.deleteEmployee(employeeId);
    return employeeId;
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    setCurrentEmployee: (state, action: PayloadAction<Employee | EmployeeWithDetails | null>) => {
      state.currentEmployee = action.payload;
    },
    setFilters: (state, action: PayloadAction<EmployeeFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { page: 1, limit: 10 };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        const total = action.payload.total || 0;
        const totalPages = action.payload.totalPages || (total > 0 ? 1 : 0);
        state.pagination = {
          total,
          page: action.payload.page || 1,
          totalPages,
        };
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee';
      })
      // Fetch employee with details
      .addCase(fetchEmployeeWithDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeWithDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeWithDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee details';
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload); // Add to beginning of list
        state.currentEmployee = action.payload;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create employee';
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update employee';
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((emp) => emp.id !== action.payload);
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete employee';
      });
  },
});

export const {
  setEmployees,
  setCurrentEmployee,
  setFilters,
  clearFilters,
  clearError,
  clearCurrentEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;


