import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Divider,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  AccountCircle,
  Settings,
  ExitToApp,
  DarkMode,
  LightMode,
  Email,
} from '@mui/icons-material';
import './styles/Navbar.css';

import { actionLogout } from "./store/authStore/authThunks";
import { useDispatch } from 'react-redux';

const Navbar = ({ onMenuClick, drawerWidth = 280 }) => {
  
  const dispatch = useDispatch();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    dispatch(actionLogout());
    handleProfileMenuClose();
    // Aquí va tu lógica de logout
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Aquí implementarías el cambio de tema
  };

  return (
    <AppBar
      position="fixed"
      className="navbar-appbar"
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
      }}
    >
      <Toolbar className="navbar-toolbar">
        {/* Botón de menú (solo móvil) */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            className="navbar-menu-button"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Título / Breadcrumb */}
        <Typography variant="h6" noWrap component="div" className="navbar-title">
          Tracker - Gestión de Trámites
        </Typography>

        {/* Barra de búsqueda */}
        {!isMobile && (
          <Box className="navbar-search-container">
            <Box className="navbar-search">
              <Search className="navbar-search-icon" />
              <InputBase
                placeholder="Buscar trámites, placas, usuarios..."
                className="navbar-search-input"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
          </Box>
        )}

        {/* Espaciador */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Iconos de acciones */}
        <Box className="navbar-actions">
          {/* Búsqueda móvil */}
          {isMobile && (
            <IconButton className="navbar-icon-button" color="inherit">
              <Search />
            </IconButton>
          )}

          {/* Toggle Dark Mode */}
          <IconButton
            className="navbar-icon-button"
            color="inherit"
            onClick={toggleDarkMode}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          {/* Mensajes */}
          <IconButton className="navbar-icon-button" color="inherit">
            <Badge badgeContent={4} color="error">
              <Email />
            </Badge>
          </IconButton>

          {/* Notificaciones */}
          <IconButton
            className="navbar-icon-button"
            color="inherit"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={12} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Perfil */}
          <IconButton
            onClick={handleProfileMenuOpen}
            className="navbar-profile-button"
          >
            <Avatar className="navbar-avatar" alt="Admin User">
              A
            </Avatar>
          </IconButton>
        </Box>

        {/* Menú de Notificaciones */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          className="navbar-menu"
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box className="navbar-menu-header">
            <Typography variant="subtitle1" className="navbar-menu-title">
              Notificaciones
            </Typography>
            <Badge badgeContent={12} color="error" />
          </Box>
          <Divider />
          <MenuItem onClick={handleNotificationsClose} className="navbar-notification-item">
            <Box className="navbar-notification-content">
              <Typography variant="body2" className="navbar-notification-title">
                Nuevo trámite asignado: TR-006
              </Typography>
              <Typography variant="caption" className="navbar-notification-time">
                Hace 5 minutos
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose} className="navbar-notification-item">
            <Box className="navbar-notification-content">
              <Typography variant="body2" className="navbar-notification-title">
                Trámite TR-003 requiere documentación
              </Typography>
              <Typography variant="caption" className="navbar-notification-time">
                Hace 1 hora
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose} className="navbar-notification-item">
            <Box className="navbar-notification-content">
              <Typography variant="body2" className="navbar-notification-title">
                Cuenta de cobro #45 pendiente
              </Typography>
              <Typography variant="caption" className="navbar-notification-time">
                Hace 3 horas
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationsClose} className="navbar-menu-footer">
            <Typography variant="body2" color="primary">
              Ver todas las notificaciones
            </Typography>
          </MenuItem>
        </Menu>

        {/* Menú de Perfil */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          className="navbar-menu"
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box className="navbar-profile-header">
            <Avatar className="navbar-profile-avatar">A</Avatar>
            <Box>
              <Typography variant="subtitle2" className="navbar-profile-name">
                Admin User
              </Typography>
              <Typography variant="caption" className="navbar-profile-email">
                admin@tracker.com
              </Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose} className="navbar-menu-item">
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose} className="navbar-menu-item">
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Configuración
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} className="navbar-menu-item navbar-logout-item">
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;