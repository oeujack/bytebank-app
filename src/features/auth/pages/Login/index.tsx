import { useState } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Slide, toast } from 'react-toastify';

import img from '@assets/imgLogin.png';

import { login } from '@features/auth/store';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { useNavigate } from 'react-router-dom';

interface LoginValues {
  username: string;
  password: string;
}

const initialValues: LoginValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Usuário obrigatório'),
  password: Yup.string()
    .min(4, 'Mínimo de 4 caracteres')
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
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          '.MuiPaper-root': {
            bgcolor: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(2rem)',
            borderRadius: 4,
            maxWidth: 600,
          },
        }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              flex={1}
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <img
                src={img}
                alt="Login"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </Box>
            <Box flex={1}>
              <DialogTitle
                variant="h4"
                sx={{
                  textAlign: 'center',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Acesso Bytebank
              </DialogTitle>
              <Typography>
                Informe os seus dados abaixo para acessá-la.
              </Typography>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await dispatch(login(values)).unwrap();

                    toast.success(
                      <div style={{ display: 'block', paddingRight: '20px' }}>
                        <span>Login realizado com sucesso!</span>
                      </div>,
                      {
                        position: 'bottom-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                        transition: Slide,
                      }
                    );
                    navigate('/dashboard');
                    onClose();
                  } catch (error) {
                    toast.error(
                      <div style={{ display: 'block', paddingRight: '20px' }}>
                        <span>
                          Erro ao realizar login. Verifique suas credenciais.
                        </span>
                      </div>,
                      {
                        position: 'bottom-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                        transition: Slide,
                      }
                    );
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
                  touched,
                  errors,
                  values,
                }) => (
                  <Box component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                      name="username"
                      label="Usuário"
                      type="string"
                      color="success"
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      error={touched.username && Boolean(errors.username)}
                      helperText={errors.username || ' '}
                      required
                      fullWidth
                      sx={{ mt: 3 }}
                      slotProps={{
                        input: {
                          sx: { borderRadius: 3 },
                        },
                      }}
                    />
                    <TextField
                      name="password"
                      label="Senha"
                      size="small"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      color="success"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={errors.password || ' '}
                      required
                      fullWidth
                      sx={{ mt: 1.5 }}
                      slotProps={{
                        input: {
                          sx: { borderRadius: 3 },
                          endAdornment: values.password.length > 0 && (
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          ),
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{
                        mt: 1,
                        borderRadius: 3,
                        background:
                          'linear-gradient(45deg,rgb(78, 143, 80) 30%,rgb(76, 180, 81) 90%)',
                        color: 'white',
                      }}
                    >
                      {isSubmitting ? 'Validando...' : 'Entrar'}
                    </Button>
                  </Box>
                )}
              </Formik>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
