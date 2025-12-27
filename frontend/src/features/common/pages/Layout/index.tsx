import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Container } from '@shared/components';

export function Layout() {
  return (
    <Box>
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}
