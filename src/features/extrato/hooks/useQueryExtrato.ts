import type { Extrato } from '@shared/interfaces';
import {
  deleteExtrato,
  getExtrato,
  postExtrato,
  updateExtrato,
} from '../services/extratoService';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ChartViewProps {
  data: string;
  entrada: number;
  saida: number;
  saldo: number;
}

export const EXTRATO_QUERY_KEY = ['extrato'];

export function useQueryGetExtrato<TSelect = Extrato[]>(
  options?: Omit<
    UseQueryOptions<Extrato[], Error, TSelect>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<Extrato[], Error, TSelect>({
    queryKey: EXTRATO_QUERY_KEY,
    queryFn: getExtrato,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useMutationPostExtrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values }: { values: Omit<Extrato, 'id'> }) =>
      postExtrato(values),

    onMutate: async ({ values }) => {
      await queryClient.cancelQueries({ queryKey: EXTRATO_QUERY_KEY });

      const previousExtrato =
        queryClient.getQueryData<Extrato[]>(EXTRATO_QUERY_KEY);

      if (previousExtrato) {
        queryClient.setQueryData<Extrato[]>(EXTRATO_QUERY_KEY, [
          ...previousExtrato,
          {
            ...values,
            id: `temp-${Date.now()}`,
            valor: Number(values.valor),
          },
        ]);
      }

      return { previousExtrato };
    },

    onError: (error: AxiosError, __, context) => {
      if (context?.previousExtrato) {
        queryClient.setQueryData(EXTRATO_QUERY_KEY, context.previousExtrato);
      }

      const message = 'Erro ao adicionar extrato';

      console.error('Erro ao inserir:', error);
      toast.error(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXTRATO_QUERY_KEY });
    },
  });
}

export function useMutationUpdateExtrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, valor }: { id: string; valor: number }) =>
      updateExtrato(id, valor),

    onMutate: async ({ id, valor }) => {
      await queryClient.cancelQueries({ queryKey: EXTRATO_QUERY_KEY });

      const previousExtrato =
        queryClient.getQueryData<Extrato[]>(EXTRATO_QUERY_KEY);

      if (previousExtrato) {
        queryClient.setQueryData<Extrato[]>(
          EXTRATO_QUERY_KEY,
          previousExtrato.map((item) =>
            item.id === id ? { ...item, valor: Number(valor) } : item
          )
        );
      }

      return { previousExtrato };
    },

    onError: (error, __, context) => {
      if (context?.previousExtrato) {
        queryClient.setQueryData(EXTRATO_QUERY_KEY, context.previousExtrato);
      }

      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXTRATO_QUERY_KEY });
    },
  });
}

export function useMutationDeleteExtrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExtrato(id),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: EXTRATO_QUERY_KEY });

      const previousExtrato =
        queryClient.getQueryData<Extrato[]>(EXTRATO_QUERY_KEY);

      if (previousExtrato) {
        queryClient.setQueryData<Extrato[]>(
          EXTRATO_QUERY_KEY,
          previousExtrato.filter((item) => item.id !== id)
        );
      }

      return { previousExtrato };
    },

    onError: (error, __, context) => {
      if (context?.previousExtrato) {
        queryClient.setQueryData(EXTRATO_QUERY_KEY, context.previousExtrato);
      }

      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXTRATO_QUERY_KEY });
    },
  });
}

export function useChartExtrato() {
  return useQueryGetExtrato<ChartViewProps[]>({
    select: (extrato) => {
      const agrupado: Record<string, { entrada: number; saida: number }> = {};

      extrato.forEach((item) => {
        if (!item.data || typeof item.valor !== 'number') return;

        if (!agrupado[item.data]) {
          agrupado[item.data] = { entrada: 0, saida: 0 };
        }

        if (item.valor >= 0) {
          agrupado[item.data].entrada += item.valor;
        } else {
          agrupado[item.data].saida += Math.abs(item.valor);
        }
      });

      let saldoAcumulado = 0;

      return Object.entries(agrupado)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([data, valores]) => {
          saldoAcumulado += valores.entrada - valores.saida;

          return {
            data: data.split('-').reverse().join('/'),
            entrada: valores.entrada,
            saida: valores.saida,
            saldo: saldoAcumulado,
          };
        });
    },
  });
}
