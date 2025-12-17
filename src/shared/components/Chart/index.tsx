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
import { useChartExtrato } from '@features/extrato/hooks';

export default function ChartView() {
  const { data: dados = [] } = useChartExtrato();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={dados} margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
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
