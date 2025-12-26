import type { Extrato } from '@shared/interfaces';

export function agruparPorData(extrato: Extrato[] = []): Record<string, Extrato[]> {
  return extrato.reduce((acc, item) => {
    const data = item.data;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(item);
    return acc;
  }, {} as Record<string, Extrato[]>);
}
