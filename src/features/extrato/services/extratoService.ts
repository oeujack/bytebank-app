import { ENV } from '@core/config';
import axios from 'axios';
import type { Extrato } from '@shared/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export async function getExtrato(): Promise<Extrato[]> {
  const response = await api.get<Extrato[]>(`${ENV.EXTRATO}`);
  return response.data;
}

export async function postExtrato(
  values: Omit<Extrato, 'id'>
): Promise<Extrato[]> {
  const response = await api.post<Extrato[]>(`${ENV.EXTRATO}`, values);
  return response.data;
}

export async function updateExtrato(
  id: string,
  valor: number
): Promise<Extrato[]> {
  const response = await api.patch<Extrato[]>(`${ENV.EXTRATO}/${id}`, { valor });
  return response.data;
}

export async function deleteExtrato(id: string): Promise<Extrato[]> {
  const response = await api.delete<Extrato[]>(`${ENV.EXTRATO}/${id}`);
  return response.data;
}
