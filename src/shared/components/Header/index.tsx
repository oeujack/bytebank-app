import { Box, IconButton, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '@features/auth/store';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import { useNavigate } from 'react-router';

export default function HeaderComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userName = useSelector((state: RootState) => state.auth.user?.name);

  function handleLogout() {
    dispatch(logout());
    navigate('/home');
  }

  return (
    <Box
      component="header"
      sx={{
        bgcolor: '#236B7A',
        backgroundImage: 'linear-gradient(45deg, #12120F, transparent)',
        color: '#FAFAFA',
        width: '100%',
        height: '56px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountCircleIcon sx={{ marginRight: '8px', color: 'white' }} />
        <Typography variant="h5">Olá, {userName}</Typography>
      </Box>

      <IconButton onClick={handleLogout}>
        <LogoutIcon sx={{ color: '#ffffff' }} />
      </IconButton>
    </Box>
  );
}
