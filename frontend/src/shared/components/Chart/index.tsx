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
} from "recharts";
import { useChartExtrato } from "@features/extrato/hooks";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function ChartView() {
  const { data: dados = [] } = useChartExtrato();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={dados}
        margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="data" />
        <YAxis yAxisId="left" tickFormatter={formatCurrency} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={formatCurrency}
        />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend
          formatter={(value) => {
            if (value === "entrada") return "Entradas";
            if (value === "saida") return "Saídas";
            if (value === "saldo") return "Saldo";
            return value;
          }}
        />
        <Bar yAxisId="left" dataKey="entrada" fill="#4eb450" />
        <Bar yAxisId="left" dataKey="saida" fill="#ff0000" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="saldo"
          stroke="#236B7A"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
