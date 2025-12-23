import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import type { RootState } from '@app/providers/store';
import { setFiltroData, type FiltroData } from '@features/extrato/store';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FiltroBuscaExtrato from '../FiltroBuscaExtrato';

export default function FiltrosRapidos() {
  const filtroSelecionado = useSelector((state: RootState) => state.extratoFilter.filtroData);
  const dispatch = useDispatch();

  const filtros = [
    { label: 'Hoje', value: 'hoje' },
    { label: 'Ontem', value: 'ontem' },
    { label: 'Últimos 7 dias', value: 'ultimos7dias' },
    { label: 'Todos', value: 'todos' },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', mx: 1, gap: 3 }}>
        <Typography variant="h5">Filtros</Typography>
        <FilterAltOutlinedIcon />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mr: 1,
        }}
      >
        <ButtonGroup disableElevation sx={{ m: 1 }} variant="outlined" size="small">
          {filtros.map((f) => (
            <Button
              key={f.value}
              variant={filtroSelecionado === f.value ? 'contained' : 'outlined'}
              onClick={() => dispatch(setFiltroData(f.value as FiltroData))}
            >
              {f.label}
            </Button>
          ))}
        </ButtonGroup>
        <FiltroBuscaExtrato />
      </Box>
    </Box>
  );
}
