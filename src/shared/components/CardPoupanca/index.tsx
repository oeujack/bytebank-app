import { Box, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState, useMemo } from "react";
import CButton from "../CButton";
import { useQueryGetExtrato } from "@features/extrato/hooks";
import { Link } from "react-router-dom";

export default function CardPoupanca() {
  const [showedBalance, setShowBalance] = useState(false);
  const { data: extrato = [] } = useQueryGetExtrato();

  function handleShowBalance() {
    setShowBalance(!showedBalance);
  }

  const saldo = useMemo(() => {
    return extrato
      .filter((item) => item.conta === "poupanca")
      .reduce((acc, item) => acc + Number(item.valor), 0);
  }, [extrato]);

  const saldoFormatado = useMemo(() => {
    return saldo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [saldo]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            filter: showedBalance ? "none" : "blur(6px)",
            transition: "filter 0.4s",
            userSelect: showedBalance ? "text" : "none",
          }}
        >
          {saldoFormatado ?? "R$ 0,00"}
        </Typography>

        {showedBalance ? (
          <VisibilityOffIcon
            sx={{
              cursor: "pointer",
              fontSize: { xs: "20px", sm: "24px" },
            }}
            onClick={handleShowBalance}
          />
        ) : (
          <VisibilityIcon
            sx={{
              cursor: "pointer",
              fontSize: { xs: "20px", sm: "24px" },
            }}
            onClick={handleShowBalance}
          />
        )}
      </Box>

      <Link to="/deposito">
        <CButton color="primary" text="Depositar" />
      </Link>
    </Box>
  );
}
