export function formatarValor(valor: number): string {
  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
  return valorFormatado;
}
