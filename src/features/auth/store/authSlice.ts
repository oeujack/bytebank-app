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

const MOCK_CREDENTIALS = {
  username: 'emmaj',
  password: 'emmajpass',
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    _values: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await getLogin(MOCK_CREDENTIALS);
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
