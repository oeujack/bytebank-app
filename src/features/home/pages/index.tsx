import { Navbar, Footer, Content } from '@features/home/components';
import { Box } from '@mui/material';

export default function PageHome() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #121212, #c6dce4)',
          paddingTop: '90px',
        }}
      >
        <Content />
      </Box>
      <Footer />
    </>
  );
}
