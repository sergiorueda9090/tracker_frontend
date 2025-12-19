import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  TrackChanges,
} from '@mui/icons-material';

import { getAuth, handleFormStoreThunk } from './store/authStore/authThunks';

import './styles/Login.css';
import { SimpleBackdrop } from './components/Backdrop/BackDrop';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { username, password } = useSelector(state => state.authStore);

  // Estados locales
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  // Estado de loading desde Redux
  const { isLogin } = useSelector((state) => state.authStore || {});

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({name, value}))
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Dispatch de la acción de login
    dispatch(getAuth(username, password, navigate));
  };

  return (
    <Box className="login-container">
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          className={`login-paper ${isMobile ? 'login-paper-mobile' : 'login-paper-desktop'}`}
        >
          {/* Logo y título */}
          <Box className="login-header">
            <Box className="login-logo-container">
              <TrackChanges className="login-logo-icon" />
            </Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              className="login-title"
            >
              Tracker
            </Typography>
            <Typography variant="body2" className="login-subtitle">
              Sistema de Gestión de Trámites de Tránsito
            </Typography>
          </Box>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLogin}
              className="login-textfield"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="login-input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLogin}
              className="login-textfield"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="login-input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      aria-label="toggle password visibility"
                      disabled={isLogin}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              className="login-submit-button"
              disabled={isLogin}
            >
              {isLogin ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </Paper>

        {/* Footer */}
        <Box className="login-footer-main">
          <Box className="login-footer-content">
            <Typography variant="body2" className="login-footer-copyright">
              © 2024 <strong>Tracker</strong>. Sistema de Gestión de Trámites de Tránsito.
            </Typography>
            <Box className="login-footer-developer">
              <Typography variant="caption" className="login-footer-dev-text">
                Desarrollado por <strong>Sergio Rueda</strong>
              </Typography>
              <Box className="login-footer-contact">
                <Typography variant="caption" className="login-footer-email">
                  📧 sergiorueda@hotmail.com
                </Typography>
                <Typography variant="caption" className="login-footer-phone">
                  📱 +57 314 380 1560
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      
      <SimpleBackdrop />
    </Box>
  );
};

export default Login;