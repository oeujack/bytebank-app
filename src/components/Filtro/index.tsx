import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

type FiltroProps = {
  filtro: string;
  setFiltro: (valor: string) => void;
  setFiltroData: (de: Date | null) => void;
};

export default function Filtro({
  filtro,
  setFiltro,
  setFiltroData,
}: Readonly<FiltroProps>) {
  const [periodoAtivo, setPeriodoAtivo] = useState<string>("");

  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const botoesPeriodo = [
    { label: "Todos", valor: "", de: null },
    { label: "Hoje", valor: "hoje", de: hoje },
    { label: "Últimos 7 dias", valor: "7d", de: seteDiasAtras },
    { label: "Este mês", valor: "mes", de: primeiroDiaDoMes },
  ];

  const handleClicarBotao = (botao: (typeof botoesPeriodo)[number]) => {
    setPeriodoAtivo(botao.valor);

    setFiltroData(botao.de);
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", padding: "0rem 2rem" }}>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {botoesPeriodo.map((botao) => (
          <Button
            key={botao.valor}
            variant={periodoAtivo === botao.valor ? "contained" : "outlined"}
            onClick={() => handleClicarBotao(botao)}
          >
            {botao.label}
          </Button>
        ))}
      </Box>
      <TextField
        fullWidth
        variant="standard"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar..."
        sx={{ mb: 4 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
