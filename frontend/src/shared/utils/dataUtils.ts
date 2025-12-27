export function isHoje(data: string): boolean {
  const hoje = new Date().toISOString().split('T')[0];
  return data === hoje;
}

export function isOntem(data: string): boolean {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  return data === ontem.toISOString().split('T')[0];
}

export function isNosUltimos7Dias(data: string): boolean {
  const dataItem = new Date(data);
  const hoje = new Date();
  const diff = hoje.getTime() - dataItem.getTime();
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dias <= 7 && dias >= 0;
}
