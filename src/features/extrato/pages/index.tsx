import Title from '@shared/components/Title';
import { Box } from '@mui/material';
import { ExtratoList, FiltrosRapidos } from '@features/extrato/components';

export default function PageExtrato() {
  return (
    <>
      <Title title="Extrato da conta-corrente" />

      <FiltrosRapidos />

      <Box
        sx={{
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#ffffff',
        }}
      >
        <ExtratoList />
      </Box>
    </>
  );
}
