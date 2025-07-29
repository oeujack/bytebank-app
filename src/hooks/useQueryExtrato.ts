import {
  deleteExtrato,
  getExtrato,
  getExtratoInfinity,
  postExtrato,
  updateExtrato,
} from "@services/extratoService";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { Extrato } from "src/types/Extrato";
import { queryClient } from "./queryClient";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export function useQueryGetExtrato() {
  const useQueryGetExtrato = useQuery<Extrato[]>({
    queryKey: ["useQueryGetExtrato"],
    queryFn: () => getExtrato(),
    staleTime: Infinity,
    retry: 0,
  });

  return useQueryGetExtrato;
}
export function useQueryGetExtratoInfinity() {
  return useInfiniteQuery({
    queryKey: ["useQueryGetExtratoInfinity"],
    queryFn: ({ pageParam = 1 }) => getExtratoInfinity(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: Infinity,
  });
}

export function useMutationPostExtrato() {
  return useMutation({
    mutationFn: ({ values }: { values: Omit<Extrato, "id"> }) =>
      postExtrato(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useQueryGetExtratoInfinity"],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as AxiosError)?.message ?? "Erro inesperado";
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
        queryKey: ["useQueryGetExtratoInfinity"],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as AxiosError)?.message ?? "Erro inesperado";
      toast.error(message);
    },
  });
}

export function useMutationDeleteExtrato() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExtrato(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useQueryGetExtratoInfinity"],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as AxiosError)?.message ?? "Erro inesperado";
      toast.error(message);
    },
  });
}
