import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Alert,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Save,
  PhotoCamera,
  Notifications,
  Security,
  Palette,
  RestartAlt,
  TextFields,
  FormatSize,
  Person,
  Business,
  Lock,
  Email,
  Phone,
  LocationOn,
  CheckCircle,
  Info,
  Brightness4,
  Language,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { PRESET_THEMES } from '../config/themesConfig';
import ThemePreview from '../components/Settings/ThemePreview';
import '../styles/Pages.css';
import '../styles/Settings.css';

const Settings = () => {
  const { currentTheme, changeTheme, resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    name: 'Admin User',
    email: 'admin@tracker.com',
    phone: '+57 300 123 4567',
    businessName: 'Tracker - Gestión de Trámites',
    address: 'Calle 123 #45-67, Bogotá',
    notifications: true,
    emailAlerts: true,
    orderNotifications: true,
    marketingEmails: false,
    language: 'es',
    timezone: 'America/Bogota',
  });

  // Estado para tema personalizado
  const [customTheme, setCustomTheme] = useState(currentTheme);

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.checked ?? event.target.value,
    });
  };

  const handleSave = () => {
    console.log('Guardando configuración:', settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleThemeSelect = (themeId) => {
    changeTheme(themeId);
  };

  const handleCustomThemeChange = (category, key, value) => {
    const updatedTheme = {
      ...customTheme,
      [category]: {
        ...customTheme[category],
        [key]: value,
      },
    };
    setCustomTheme(updatedTheme);
  };

  const applyCustomTheme = () => {
    changeTheme(customTheme);
  };

  return (
    <Box className="page-container settings-container">
      {/* Header mejorado */}
      <Box className="settings-header">
        <Box>
          <Typography variant="h4" className="page-title settings-main-title">
            ⚙️ Configuración
          </Typography>
          <Typography variant="body2" className="page-subtitle settings-main-subtitle">
            Personaliza tu experiencia en Tracker
          </Typography>
        </Box>
        {saveSuccess && (
          <Alert
            icon={<CheckCircle />}
            severity="success"
            className="settings-success-alert"
          >
            ¡Cambios guardados exitosamente!
          </Alert>
        )}
      </Box>

      {/* Tabs mejorados con contadores */}
      <Paper className="page-paper settings-tabs-container" elevation={0}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          className="settings-tabs-enhanced"
        >
          <Tab
            icon={<Person />}
            iconPosition="start"
            label="Cuenta"
            className="settings-tab-item"
          />
          <Tab
            icon={<Palette />}
            iconPosition="start"
            label="Apariencia"
            className="settings-tab-item"
          />
          <Tab
            icon={<Security />}
            iconPosition="start"
            label="Seguridad"
            className="settings-tab-item"
          />
          <Tab
            icon={
              <Badge badgeContent={2} color="error">
                <Notifications />
              </Badge>
            }
            iconPosition="start"
            label="Notificaciones"
            className="settings-tab-item"
          />
        </Tabs>
      </Paper>

      {/* Tab 0: Cuenta */}
      {activeTab === 0 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            {/* Perfil con diseño mejorado */}
            <Grid item xs={12}>
              <Card className="settings-profile-card" elevation={0}>
                <CardContent>
                  <Box className="settings-profile-header">
                    <Box className="profile-avatar-section">
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <IconButton
                            className="avatar-upload-button-enhanced"
                            component="label"
                            size="small"
                          >
                            <PhotoCamera fontSize="small" />
                            <input type="file" hidden accept="image/*" />
                          </IconButton>
                        }
                      >
                        <Avatar className="profile-avatar-extra-large">
                          {settings.name.charAt(0)}
                        </Avatar>
                      </Badge>
                    </Box>
                    <Box className="profile-info-section">
                      <Typography variant="h5" className="profile-name">
                        {settings.name}
                      </Typography>
                      <Typography variant="body2" className="profile-role">
                        Administrador Principal
                      </Typography>
                      <Chip
                        icon={<CheckCircle />}
                        label="Cuenta Verificada"
                        color="success"
                        size="small"
                        className="profile-verified-chip"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Información Personal */}
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Person className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Información Personal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Administra tu información básica de perfil
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      value={settings.name}
                      onChange={handleChange('name')}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Person className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      type="email"
                      value={settings.email}
                      onChange={handleChange('email')}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Email className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={settings.phone}
                      onChange={handleChange('phone')}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Phone className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Idioma</InputLabel>
                      <Select
                        value={settings.language}
                        label="Idioma"
                        onChange={handleChange('language')}
                        startAdornment={<Language className="input-icon" />}
                      >
                        <MenuItem value="es">🇪🇸 Español</MenuItem>
                        <MenuItem value="en">🇺🇸 English</MenuItem>
                        <MenuItem value="pt">🇧🇷 Português</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Información del Negocio */}
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Business className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Información del Negocio
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Datos corporativos de tu empresa
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre del Negocio"
                      value={settings.businessName}
                      onChange={handleChange('businessName')}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Business className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      value={settings.address}
                      onChange={handleChange('address')}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <LocationOn className="input-icon" />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Botones de acción */}
            <Grid item xs={12}>
              <Box className="settings-actions-modern">
                <Button variant="outlined" size="large" className="settings-cancel-btn">
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSave}
                  className="action-button settings-save-btn"
                >
                  Guardar Cambios
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 1: Apariencia (Temas) */}
      {activeTab === 1 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            {/* Temas Predefinidos */}
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-with-action-enhanced">
                  <Box>
                    <Box className="settings-section-header-modern">
                      <Box className="settings-section-icon-wrapper">
                        <Palette className="settings-section-icon-large" />
                      </Box>
                      <Box>
                        <Typography variant="h6" className="settings-section-title-enhanced">
                          Temas Predefinidos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Selecciona un tema profesional para tu plataforma
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Tooltip title="Restaurar tema original">
                    <Button
                      variant="outlined"
                      startIcon={<RestartAlt />}
                      onClick={resetTheme}
                      size="medium"
                      className="settings-reset-btn"
                    >
                      Restaurar
                    </Button>
                  </Tooltip>
                </Box>

                <Box className="themes-grid-enhanced">
                  {PRESET_THEMES.map((theme) => (
                    <ThemePreview
                      key={theme.id}
                      theme={theme}
                      isSelected={currentTheme.id === theme.id}
                      onSelect={() => handleThemeSelect(theme.id)}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Personalización Avanzada */}
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Brightness4 className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Personalización Avanzada
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Crea un tema único ajustando cada detalle
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  {/* Colores Principales */}
                  <Grid item xs={12} lg={4}>
                    <Box className="custom-theme-section-modern">
                      <Box className="custom-theme-header">
                        <Palette className="custom-theme-icon" />
                        <Typography variant="subtitle1" className="custom-theme-title">
                          Colores Principales
                        </Typography>
                      </Box>
                      <Box className="custom-theme-inputs">
                        <Box className="color-picker-group">
                          <Typography variant="caption" className="color-label">
                            Color Primario
                          </Typography>
                          <TextField
                            fullWidth
                            type="color"
                            value={customTheme.colors.primary}
                            onChange={(e) =>
                              handleCustomThemeChange('colors', 'primary', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            className="color-input"
                          />
                        </Box>
                        <Box className="color-picker-group">
                          <Typography variant="caption" className="color-label">
                            Color Secundario
                          </Typography>
                          <TextField
                            fullWidth
                            type="color"
                            value={customTheme.colors.secondary}
                            onChange={(e) =>
                              handleCustomThemeChange('colors', 'secondary', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            className="color-input"
                          />
                        </Box>
                        <Box className="color-picker-group">
                          <Typography variant="caption" className="color-label">
                            Color de Fondo
                          </Typography>
                          <TextField
                            fullWidth
                            type="color"
                            value={customTheme.colors.background}
                            onChange={(e) =>
                              handleCustomThemeChange('colors', 'background', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            className="color-input"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Tipografía */}
                  <Grid item xs={12} lg={4}>
                    <Box className="custom-theme-section-modern">
                      <Box className="custom-theme-header">
                        <TextFields className="custom-theme-icon" />
                        <Typography variant="subtitle1" className="custom-theme-title">
                          Tipografía
                        </Typography>
                      </Box>
                      <Box className="custom-theme-inputs">
                        <FormControl fullWidth>
                          <InputLabel>Fuente Principal</InputLabel>
                          <Select
                            value={customTheme.fonts.primary}
                            label="Fuente Principal"
                            onChange={(e) =>
                              handleCustomThemeChange('fonts', 'primary', e.target.value)
                            }
                          >
                            <MenuItem value="'Poppins', sans-serif">Poppins</MenuItem>
                            <MenuItem value="'Inter', sans-serif">Inter</MenuItem>
                            <MenuItem value="'Roboto', sans-serif">Roboto</MenuItem>
                            <MenuItem value="'Montserrat', sans-serif">Montserrat</MenuItem>
                            <MenuItem value="'Lato', sans-serif">Lato</MenuItem>
                            <MenuItem value="'Open Sans', sans-serif">Open Sans</MenuItem>
                          </Select>
                        </FormControl>

                        <Box className="slider-group">
                          <Box className="slider-header">
                            <FormatSize className="slider-icon" />
                            <Typography variant="body2" color="text.secondary">
                              Tamaño Base
                            </Typography>
                            <Chip
                              label={customTheme.fonts.size.medium}
                              size="small"
                              className="slider-value-chip"
                            />
                          </Box>
                          <Slider
                            value={parseInt(customTheme.fonts.size.medium)}
                            onChange={(e, val) => {
                              const newSizes = {
                                small: `${val - 2}px`,
                                medium: `${val}px`,
                                large: `${val + 2}px`,
                                xlarge: `${val + 6}px`,
                                xxlarge: `${val + 10}px`,
                              };
                              handleCustomThemeChange('fonts', 'size', newSizes);
                            }}
                            min={12}
                            max={18}
                            marks
                            valueLabelDisplay="auto"
                            className="custom-slider"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Espaciado */}
                  <Grid item xs={12} lg={4}>
                    <Box className="custom-theme-section-modern">
                      <Box className="custom-theme-header">
                        <Info className="custom-theme-icon" />
                        <Typography variant="subtitle1" className="custom-theme-title">
                          Espaciado
                        </Typography>
                      </Box>
                      <Box className="custom-theme-inputs">
                        <Box className="slider-group">
                          <Box className="slider-header">
                            <Typography variant="body2" color="text.secondary">
                              Radio de Bordes
                            </Typography>
                            <Chip
                              label={customTheme.spacing.borderRadius}
                              size="small"
                              className="slider-value-chip"
                            />
                          </Box>
                          <Slider
                            value={parseInt(customTheme.spacing.borderRadius)}
                            onChange={(e, val) =>
                              handleCustomThemeChange('spacing', 'borderRadius', `${val}px`)
                            }
                            min={4}
                            max={32}
                            marks
                            valueLabelDisplay="auto"
                            className="custom-slider"
                          />
                        </Box>

                        <Box className="slider-group">
                          <Box className="slider-header">
                            <Typography variant="body2" color="text.secondary">
                              Padding
                            </Typography>
                            <Chip
                              label={customTheme.spacing.padding}
                              size="small"
                              className="slider-value-chip"
                            />
                          </Box>
                          <Slider
                            value={parseInt(customTheme.spacing.padding)}
                            onChange={(e, val) =>
                              handleCustomThemeChange('spacing', 'padding', `${val}px`)
                            }
                            min={12}
                            max={40}
                            marks
                            step={2}
                            valueLabelDisplay="auto"
                            className="custom-slider"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Vista Previa del Tema Personalizado */}
                  <Grid item xs={12}>
                    <Box className="custom-theme-preview-section">
                      <Typography variant="h6" className="preview-title">
                        👁️ Vista Previa en Tiempo Real
                      </Typography>
                      <Box className="custom-theme-preview-enhanced">
                        <Box
                          className="custom-theme-preview-card-enhanced"
                          style={{
                            background: customTheme.colors.surface,
                            borderRadius: customTheme.spacing.borderRadius,
                            padding: customTheme.spacing.padding,
                          }}
                        >
                          <Typography
                            variant="h6"
                            style={{
                              fontFamily: customTheme.fonts.primary,
                              fontSize: customTheme.fonts.size.large,
                              color: customTheme.colors.text,
                              marginBottom: '16px',
                            }}
                          >
                            Título de Ejemplo
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{
                              fontFamily: customTheme.fonts.secondary,
                              fontSize: customTheme.fonts.size.medium,
                              color: customTheme.colors.textSecondary,
                              marginBottom: '16px',
                            }}
                          >
                            Este es un ejemplo de cómo se verá el contenido con tu tema personalizado
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                              variant="contained"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary} 0%, ${customTheme.colors.primaryLight} 100%)`,
                                borderRadius: customTheme.spacing.borderRadius,
                                fontFamily: customTheme.fonts.primary,
                              }}
                            >
                              Botón Principal
                            </Button>
                            <Chip
                              label="Etiqueta"
                              style={{
                                background: customTheme.colors.secondary,
                                borderRadius: `calc(${customTheme.spacing.borderRadius} / 2)`,
                              }}
                            />
                            <Chip
                              label="Éxito"
                              style={{
                                background: customTheme.colors.success,
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Botón de Aplicar Tema Personalizado */}
                  <Grid item xs={12}>
                    <Box className="settings-actions-modern">
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Palette />}
                        onClick={applyCustomTheme}
                        className="action-button settings-apply-theme-btn"
                        fullWidth
                      >
                        Aplicar Tema Personalizado
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 2: Seguridad */}
      {activeTab === 2 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Security className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Seguridad de la Cuenta
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Protege tu cuenta con una contraseña segura
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contraseña Actual"
                      type="password"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Lock className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nueva Contraseña"
                      type="password"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Lock className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity="info" icon={<Info />}>
                      Tu contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números
                    </Alert>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="settings-actions-modern">
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        className="action-button"
                      >
                        Actualizar Contraseña
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 3: Notificaciones */}
      {activeTab === 3 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Notifications className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Notificaciones Push
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alertas en tiempo real
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box className="settings-options-modern">
                  <Box className="settings-option-item">
                    <Box>
                      <Typography variant="body1" className="option-title">
                        Notificaciones del Sistema
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recibe alertas importantes del sistema
                      </Typography>
                    </Box>
                    <Switch
                      checked={settings.notifications}
                      onChange={handleChange('notifications')}
                      color="primary"
                    />
                  </Box>
                  <Divider />
                  <Box className="settings-option-item">
                    <Box>
                      <Typography variant="body1" className="option-title">
                        Nuevos Pedidos
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Notificación cuando llegue un nuevo pedido
                      </Typography>
                    </Box>
                    <Switch
                      checked={settings.orderNotifications}
                      onChange={handleChange('orderNotifications')}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Email className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Notificaciones por Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Correos electrónicos informativos
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box className="settings-options-modern">
                  <Box className="settings-option-item">
                    <Box>
                      <Typography variant="body1" className="option-title">
                        Alertas por Email
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recibe resúmenes diarios por correo
                      </Typography>
                    </Box>
                    <Switch
                      checked={settings.emailAlerts}
                      onChange={handleChange('emailAlerts')}
                      color="primary"
                    />
                  </Box>
                  <Divider />
                  <Box className="settings-option-item">
                    <Box>
                      <Typography variant="body1" className="option-title">
                        Emails de Marketing
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Promociones y novedades
                      </Typography>
                    </Box>
                    <Switch
                      checked={settings.marketingEmails}
                      onChange={handleChange('marketingEmails')}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Settings;