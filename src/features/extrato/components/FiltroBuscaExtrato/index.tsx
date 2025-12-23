import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { RootState } from '@app/providers/store';
import { setFiltroBusca } from '@features/extrato/store';

export default function FiltroBuscaExtrato() {
  const busca = useSelector((state: RootState) => state.extratoFilter.filtroBusca);
  const dispatch = useDispatch();

  return (
    <Box>
      <TextField
        size="small"
        placeholder="Buscar..."
        value={busca}
        onChange={(e) => dispatch(setFiltroBusca(e.target.value))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
