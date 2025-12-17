import { ENV } from '@core/config';
import axios from 'axios';

export async function getLogin(values: { username: string; password: string }) {
  try {
    const response = await axios.post(`${ENV.AUTH}`, values);

    const token = response.data.accessToken;
    if (token) {
      sessionStorage.setItem('token', token);
      console.log('Login realizado com sucesso, token salvo.');
      return token;
    } else {
      throw new Error('Erro: Token não retornado pela API.');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao realizar login:', error.response?.data);

      throw new Error(
        error.response?.data?.message || 'Erro ao realizar login.'
      );
    } else {
      throw new Error('Erro desconhecido ao tentar realizar login.');
    }
  }
}

export function getToken() {
  return sessionStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}
