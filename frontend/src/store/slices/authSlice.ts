import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginFormData } from '../../types';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../config/constants';
import { apiClient } from '../../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Backend API response wrapper
interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    accessToken: string;
    refreshToken: string;
  };
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      // Use apiClient with axios - backend wraps response in { success, message, data }
      const response = await apiClient.post<AuthApiResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Extract data from wrapped response
      const { user: backendUser, accessToken } = response.data;
      
      // Transform backend user to frontend User format
      const frontendUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
        avatar: undefined, // Backend doesn't provide avatar yet
        createdAt: new Date(backendUser.createdAt),
      };
      
      // Store the access token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      
      return { user: frontendUser, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Invalid credentials');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    // Call logout API if needed
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

