import { useState } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogContent,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginThunk } from '@features/auth/store/useAuthStore';
import { useTheme } from '@shared/styles/useTheme';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: Yup.string()
    .min(4, 'Mínimo de 6 caracteres')
    .required('Senha obrigatória'),
});

export function Login({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { inputStyle } = useTheme();

  const cardVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
    exit: { x: 50, opacity: 0 },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
      PaperProps={{
        component: motion.div,
        variants: cardVariants,
        initial: 'hidden',
        animate: 'visible',
        exit: 'exit',
        sx: {
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        },
      }}
    >
      <DialogContent sx={{ p: 3, overflow: 'visible' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}
          >
            Acesse sua conta
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
            Entre com suas credenciais para continuar.
          </Typography>

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                await dispatch(
                  loginThunk({
                    email: values.email,
                    password: values.password,
                  })
                ).unwrap();

                toast.success('Login realizado com sucesso!');
                navigate('/dashboard');
                resetForm();
              } catch (error) {
                toast.error('Erro ao efetuar login!');
                console.error('Erro login:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              isSubmitting,
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              touched,
            }) => (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="caption" sx={{ fontWeight: 700, ml: 1 }}>
                  E-mail
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  placeholder="Digite o e-mail"
                  variant="outlined"
                  margin="dense"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={inputStyle}
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, ml: 1 }}>
                    Senha
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    variant="outlined"
                    margin="dense"
                    onChange={handleChange}
                    sx={inputStyle}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      },
                    }}
                  />
                </Box>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      bgcolor: '#1a1a1a',
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#333' },
                    }}
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </motion.div>
              </Box>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
