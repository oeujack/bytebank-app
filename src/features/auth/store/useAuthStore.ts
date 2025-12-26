import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Usuario, UsuarioLogin } from '@shared/interfaces/usuario';
import { login } from '../services/login-service';

interface AuthState {
  isAuthenticated: boolean;
  user: Usuario['user'] | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!sessionStorage.getItem('token'),
  user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  loading: false,
};

export const loginThunk = createAsyncThunk(
  'sessions',
  async (credentials: UsuarioLogin, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Erro ao autenticar');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<Usuario>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      )
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
