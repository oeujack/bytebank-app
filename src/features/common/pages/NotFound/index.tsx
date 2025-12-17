import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#121212',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <h1>404 - Página não encontrada</h1>
      <p>Desculpe, a página que você está procurando não existe.</p>
      <Link to="/dashboard">
        <Button variant="contained" sx={{ mt: 2 }}>
          Voltar para Dashboard
        </Button>
      </Link>
    </Box>
  );
}
