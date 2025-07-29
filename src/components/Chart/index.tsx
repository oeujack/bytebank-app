

import { useQueryGetExtrato } from '@hooks/useQueryExtrato'
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface ChartViewProps {
  data: string
  contaCorrente: number
  contaPoupanca: number
}

export default function ChartView() {
  const { data: extrato = [] } = useQueryGetExtrato()

  const dados: ChartViewProps[] = useMemo(() => {
    const agrupado: Record<string, { contaCorrente: number; contaPoupanca: number }> = {}

    extrato.forEach((item) => {
      if (!item.data || typeof item.valor !== 'number') return

      if (item.valor >= 0) return

      const dataKey = item.data
      if (!agrupado[dataKey]) {
        agrupado[dataKey] = { contaCorrente: 0, contaPoupanca: 0 }
      }

      const valor = Math.abs(item.valor)

      if (item.conta === 'conta-corrente') {
        agrupado[dataKey].contaCorrente += valor
      } else if (item.conta === 'conta-poupança') {
        agrupado[dataKey].contaPoupanca += valor
      }
    })

    return Object.entries(agrupado)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, valores]) => ({
        data: new Date(data).toLocaleDateString('pt-BR'),
        contaCorrente: parseFloat(valores.contaCorrente.toFixed(2)),
        contaPoupanca: parseFloat(valores.contaPoupanca.toFixed(2)),
      }))
  }, [extrato])

  return (
    <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {dados.length === 0 ? (
        <p style={{ color: '#999' }}>Nenhum movimento encontrado para exibir no gráfico.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Bar dataKey="contaCorrente" barSize={20} fill="#1976d2" name="Conta Corrente" />
            <Bar dataKey="contaPoupanca" barSize={20} fill="#4caf50" name="Conta Poupança" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}



