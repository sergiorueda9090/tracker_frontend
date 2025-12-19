import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from "../../store/userStore/userThunks";
import { showAlert } from "../../store/globalStore/globalStore";

const MainDialog = ({ open, onClose }) => {
  
  const roles = [
    { value: 'admin', label: 'Administrador de Sistema' },
    { value: 'gestor', label: 'Gestor Operativo' },
    { value: 'proveedor', label: 'Proveedor / Tramitador' },
    { value: 'financiero', label: 'Analista de Facturación' },
  ];

  const { id,
          username,
          password,
          email,
          first_name,
          last_name,
          role } = useSelector(state => state.userStore);
  
  // Estado local para controlar la visibilidad del password
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleChangeForm = (e) => {
    const {name, value} = e.target;
    dispatch(handleFormStoreThunk({name, value}));
  }

  const handleSave = () => {
    // Validaciones básicas
    if (!username.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El nombre de usuario es obligatorio. Por favor, ingrese un nombre de usuario válido.",
      }));
      return;
    }

    if (!email.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El correo electrónico es obligatorio. Por favor, ingrese una dirección de correo válida.",
      }));
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(showAlert({
        type: "error",
        title: "📧 Email Inválido",
        text: "Por favor, ingrese un correo electrónico con formato válido (ejemplo: usuario@dominio.com).",
      }));
      return;
    }

    if (!first_name.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El nombre es obligatorio. Por favor, ingrese el nombre del usuario.",
      }));
      return;
    }

    if (!last_name.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El apellido es obligatorio. Por favor, ingrese el apellido del usuario.",
      }));
      return;
    }

    if (!role) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Rol No Seleccionado",
        text: "Debe seleccionar un rol para el usuario. Elija entre Administrador, Vendedor, Contador o Cliente.",
      }));
      return;
    }

    // Si es nuevo usuario, validar password
    if (!id && !password.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "🔐 Contraseña Requerida",
        text: "La contraseña es obligatoria para usuarios nuevos. Por favor, establezca una contraseña segura.",
      }));
      return;
    }

    // Validar longitud de contraseña si se proporciona
    if (password.trim() && password.length < 8) {
      dispatch(showAlert({
        type: "error",
        title: "🔐 Contraseña Insegura",
        text: "La contraseña debe tener al menos 8 caracteres para garantizar la seguridad de la cuenta.",
      }));
      return;
    }

    // Preparar datos
    const data = {
      username,
      email,
      first_name,
      last_name,
      role
    };

    // Solo incluir password si hay valor
    if (password.trim()) {
      data.password = password;
    }

    // Llamar al thunk correspondiente
    if (id) {
      dispatch(updateThunks(id, data));
    } else {
      dispatch(createThunks(data));
    }
  }

  // Función para alternar la visibilidad del password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {id ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Información Básica */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              📋 Información Básica
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                name="username"
                value={username}
                onChange={handleChangeForm}
                required
                helperText="Usuario único para iniciar sesión"
                error={!username.trim()}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="first_name"
                  value={first_name}
                  onChange={handleChangeForm}
                  required
                  error={!first_name.trim()}
                />

                <TextField
                  fullWidth
                  label="Apellido"
                  name="last_name"
                  value={last_name}
                  onChange={handleChangeForm}
                  required
                  error={!last_name.trim()}
                />
              </Box>

              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={email}
                onChange={handleChangeForm}
                required
                helperText="Ej: usuario@ejemplo.com"
                error={!email.trim()}
              />
            </Box>
          </Box>

          {/* Seguridad y Rol */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              🔐 Seguridad y Permisos
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleChangeForm}
                required={!id}
                helperText={id ? 'Dejar en blanco para mantener la contraseña actual' : 'Mínimo 8 caracteres'}
                error={!id && !password.trim()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                select
                label="Rol"
                name="role"
                value={role}
                onChange={handleChangeForm}
                required
                helperText="Selecciona el rol del usuario en el sistema"
                error={!role}
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          className="action-button"
        >
          {id ? '💾 Guardar Cambios' : '✨ Crear Usuario'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;