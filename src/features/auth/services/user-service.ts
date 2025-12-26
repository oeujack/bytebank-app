import type { UsuarioLogin } from '@shared/interfaces/usuario';
import { api } from './auth/api-auth-service';

export const login = async (credentials: UsuarioLogin) => {
  return await api.post('/sessions', credentials);
};

export const createUser = async (credentials: UsuarioLogin) => {
  return await api.post('/users', credentials);
};
