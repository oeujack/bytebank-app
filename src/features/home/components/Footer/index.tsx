import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import bytebankLogo from '@assets/logo_small_white.png';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isMobile ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
        backdropFilter: isMobile ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'none',
        height: { xs: '60px', md: '70px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <img
          src={bytebankLogo}
          alt="Bytebank Logo"
          width={30}
          style={{ opacity: 0.6 }}
        />
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.85rem',
            fontWeight: 400,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Desenvolvido por Tech Challenge FIAP
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          color: 'rgba(255, 255, 255, 0.6)',
          '& svg': {
            fontSize: 22,
            cursor: 'pointer',
            transition: '0.3s',
            '&:hover': { color: '#fff', transform: 'translateY(-2px)' },
          },
        }}
      >
        <InstagramIcon />
        <WhatsAppIcon />
        <YouTubeIcon />
      </Box>
    </Box>
  );
}
