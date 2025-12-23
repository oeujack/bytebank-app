export function formatarDataGrupo(data: string): string {
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const dataComparar = new Date(data + 'T00:00:00');

  const dataFormatada = dataComparar.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  if (dataComparar.toDateString() === hoje.toDateString()) {
    return `Hoje - ${dataFormatada}`;
  }
  if (dataComparar.toDateString() === ontem.toDateString()) {
    return `Ontem - ${dataFormatada}`;
  }
  return dataFormatada;
}
