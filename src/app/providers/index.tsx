import { CssBaseline, ThemeProvider } from '@mui/material';
import { useTheme } from '@shared/styles/useTheme';
import '@shared/styles/App.css';
import { ToastContainer } from 'react-toastify';
import Routes from '@routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@shared/hooks/queryClient';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';

export default function AppProviders() {
  const theme = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer />
            <Routes />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}
