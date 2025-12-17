import { Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useMemo } from 'react';
import CButton from '../CButton';
import { useQueryGetExtrato } from '@features/extrato/hooks';
import { Link } from 'react-router-dom';
import type { Extrato } from '@shared/types';

export default function CardPoupanca() {
  const [showedBalance, setShowBalance] = useState(false);
  const { data } = useQueryGetExtrato();

  function handleShowBalance() {
    setShowBalance(!showedBalance);
  }

  const totalPoupanca = useMemo(() => {
    if (!data) return null;

    const total = data
      .filter((item: Extrato) => item.conta === 'conta-poupança' && typeof item.valor === 'number')
      .reduce((acc: number, item: Extrato) => acc + item.valor, 0);

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }, [data]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              filter: showedBalance ? 'none' : 'blur(6px)',
              transition: 'filter 0.4s',
              userSelect: showedBalance ? 'text' : 'none',
            }}
          >
            {totalPoupanca ?? 'R$ 0,00'}
          </Typography>

          {showedBalance ? (
            <VisibilityOffIcon
              sx={{
                cursor: 'pointer',
                fontSize: { xs: '20px', sm: '24px' },
              }}
              onClick={handleShowBalance}
            />
          ) : (
            <VisibilityIcon
              sx={{
                cursor: 'pointer',
                fontSize: { xs: '20px', sm: '24px' },
              }}
              onClick={handleShowBalance}
            />
          )}
        </Box>

        <Link to="/deposito">
          <CButton color="primary" text="Depositar" />
        </Link>
      </Box>
    </>
  );
}
