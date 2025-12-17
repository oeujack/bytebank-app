import { useQueryGetExtrato } from '@features/extrato/hooks';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

interface ChartViewProps {
  data: string;
  entrada: number;
  saida: number;
  saldo: number;
}

export default function ChartView() {
  const { data: extrato = [] } = useQueryGetExtrato();

  const dados: ChartViewProps[] = useMemo(() => {
    const agrupado: Record<string, { entrada: number; saida: number }> = {};

    extrato.forEach((item) => {
      if (!item.data || typeof item.valor !== 'number') return;

      const dataKey = item.data;
      if (!agrupado[dataKey]) {
        agrupado[dataKey] = { entrada: 0, saida: 0 };
      }

      if (item.valor >= 0) {
        agrupado[dataKey].entrada += item.valor;
      } else {
        agrupado[dataKey].saida += Math.abs(item.valor);
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
  }, [extrato]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={dados}
        margin={{
          top: 20,
          right: 80,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="data" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="entrada" fill="#4eb450" />
        <Bar yAxisId="left" dataKey="saida" fill="#ff0000" />
        <Line yAxisId="right" type="monotone" dataKey="saldo" stroke="#236B7A" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
