import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { getLogin } from '../services/authBaseService';

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!sessionStorage.getItem('token'),
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    values: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await getLogin(values);
      dispatch(setIsAuthenticated(true));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      sessionStorage.removeItem('token');
      state.isAuthenticated = false;
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { logout, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
