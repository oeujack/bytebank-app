import { Navbar, Footer, Content } from '@features/home/components';
import { Box } from '@mui/material';
import videoBg from '@assets/bank.mp4';

export default function PageHome() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        src={videoBg}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: -1,
        }}
      />

      <Navbar />

      <Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
        <Content />
      </Box>

      <Footer />
    </Box>
  );
}
