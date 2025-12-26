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
import { RegisterUser } from '@features/auth/pages/RegisterUser';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

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
        height: { xs: '70px', md: '90px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
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
            borderRadius: '50px',
            p: '6px',
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
              onClick={() => setOpenLogin(true)}
            >
              Área Exclusiva
            </Button>

            <CButton
              text="Abrir conta"
              onClick={() => setOpenRegister(true)}
              sx={{
                whiteSpace: 'nowrap',
                textTransform: 'none',
                bgcolor: '#fff',
                color: '#000',
                borderRadius: '50px',
                px: 4,
                fontWeight: 700,
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            />
          </>
        ) : (
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MenuIcon sx={{ color: '#fff' }} />
          </IconButton>
        )}
      </Box>

      <Login open={openLogin} onClose={() => setOpenLogin(false)} />

      <RegisterUser
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />

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
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setOpenLogin(true);
          }}
        >
          Entrar (Login)
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setOpenRegister(true);
          }}
        >
          Abrir Conta
        </MenuItem>
      </Menu>
    </Box>
  );
}
