import { ENV } from "@config/env";
import axios from "axios";

import type { Extrato } from "src/types/Extrato";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export async function getExtrato(): Promise<Extrato[]> {
  const response = await api.get<Extrato[]>(`${ENV.EXTRATO}`);
  return response.data;
}

export async function getExtratoInfinity(
  page: number = 1,
  limit: number = 20
): Promise<{ data: Extrato[]; hasMore: boolean }> {
  // Busca todos os dados de uma vez só (sem paginação no backend)
  const response = await api.get<Extrato[]>(`${ENV.EXTRATO}`);

  // Ordena por data decrescente (mais novos primeiro)
  const data = [...response.data]; // Cria uma cópia para não mutar original
  data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Calcula início e fim da "página"
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = data.slice(start, end);
  const hasMore = end < data.length;

  return {
    data: paginated,
    hasMore,
  };
}

export async function postExtrato(
  values: Omit<Extrato, "id">
): Promise<Extrato[]> {
  const response = await api.post<Extrato[]>(`${ENV.EXTRATO}`, values);
  return response.data;
}

export async function updateExtrato(
  id: string,
  valor: number
): Promise<Extrato[]> {
  console.log("id:", id, "valor:", valor);
  const response = await api.patch<Extrato[]>(`${ENV.EXTRATO}/${id}`, {
    valor,
  });
  return response.data;
}

export async function deleteExtrato(id: string): Promise<Extrato[]> {
  const response = await api.delete<Extrato[]>(`${ENV.EXTRATO}/${id}`);
  return response.data;
}
