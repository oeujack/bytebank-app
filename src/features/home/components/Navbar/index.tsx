import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '@assets/logo.png';
import { useState } from 'react';
import CButton from '@shared/components/CButton';
import { Login } from '@features/auth/pages/Login';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const navLinks = [
    'Seguro de vida',
    'Conta PJ',
    'Cartão de crédito',
    'Contato',
  ];

  return (
    <Box
      sx={{
        bgcolor: isMobile ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
        backdropFilter: isMobile ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'none',
        height: { xs: '70px', md: '90px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <img src={logo} alt="Logo Bytebank" width={140} />
      </Box>

      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            p: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {navLinks.map((link) => (
            <Button
              key={link}
              sx={{
                color: '#fff',
                textTransform: 'none',
                borderRadius: '50px',
                px: 2,
                fontSize: '0.85rem',
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              {link}
            </Button>
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'flex-end',
          flex: 1,
        }}
      >
        {!isMobile ? (
          <>
            <Button
              sx={{ color: '#fff', textTransform: 'none', fontWeight: 600 }}
              onClick={() => setOpen(true)}
            >
              Área Exclusiva
            </Button>
            <CButton
              text="Abrir conta"
              sx={{
                whiteSpace: 'nowrap',
                textTransform: 'none',
                bgcolor: '#fff',
                color: '#000',
                borderRadius: '50px',
                px: 4,
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            />
          </>
        ) : (
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MenuIcon sx={{ color: '#fff' }} />
          </IconButton>
        )}
      </Box>

      <Login open={open} onClose={() => setOpen(false)} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {navLinks.map((link) => (
          <MenuItem key={link} onClick={() => setAnchorEl(null)}>
            {link}
          </MenuItem>
        ))}
        <MenuItem onClick={() => setOpen(true)}>Sign in</MenuItem>
      </Menu>
    </Box>
  );
}
