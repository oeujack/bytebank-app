import {
  deleteExtrato,
  getExtrato,
  postExtrato,
  updateExtrato,
} from '../services/extratoService';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Extrato } from '@shared/types';
import { queryClient } from '@shared/hooks/queryClient';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function useQueryGetExtrato() {
  const useQueryGetExtrato = useQuery<Extrato[]>({
    queryKey: ['useQueryGetExtrato'],
    queryFn: () => getExtrato(),
    staleTime: Infinity,
    retry: 0,
  });

  return useQueryGetExtrato;
}

export function useMutationPostExtrato() {
  return useMutation({
    mutationFn: ({ values }: { values: Omit<Extrato, 'id'> }) =>
      postExtrato(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useQueryGetExtrato'],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as AxiosError)?.message ?? 'Erro inesperado';
      toast.error(message);
    },
  });
}

export function useMutationUpdateExtrato() {
  return useMutation({
    mutationFn: ({ id, valor }: { id: string; valor: number }) =>
      updateExtrato(id, valor),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useQueryGetExtrato'],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as AxiosError)?.message ?? 'Erro inesperado';
      toast.error(message);
    },
  });
}

export function useMutationDeleteExtrato() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExtrato(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useQueryGetExtrato'],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as AxiosError)?.message ?? 'Erro inesperado';
      toast.error(message);
    },
  });
}
