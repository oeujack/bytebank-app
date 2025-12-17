import { Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import logoSmall from '@assets/logo_small_white.png';
import { useMemo, useState } from 'react';
import { useQueryGetExtrato } from '@features/extrato/hooks';
import { Link } from 'react-router-dom';
import type { Extrato } from '@shared/types';

export default function Balance() {
  const [showedBalance, setShowBalance] = useState(false);
  const { data } = useQueryGetExtrato();

  function handleShowBalance() {
    setShowBalance(!showedBalance);
  }

  const totalCorrente = useMemo(() => {
    if (!data) return null;

    const total = data
      .filter((item: Extrato) => item.conta === 'conta-corrente')
      .reduce((acc: number, item: Extrato) => acc + Number(item.valor), 0);

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }, [data]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        borderBottom: '1px solid #454545',
        px: 2,
        py: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Saldo
        </Typography>
        <img src={logoSmall} alt="Logo" width={21} height={20} />
      </Box>

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
            {totalCorrente ?? 'R$ 0,00'}
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

        <Link to="/extrato">
          <Typography
            sx={{
              color: 'white',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Ver extrato
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
