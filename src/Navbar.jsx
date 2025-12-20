import React, { useState, useEffect } from 'react';
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
  AvatarGroup,
  Tooltip,
  Chip,
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
  People,
  FiberManualRecord,
} from '@mui/icons-material';
import './styles/Navbar.css';

import { actionLogout } from "./store/authStore/authThunks";
import { useDispatch } from 'react-redux';
import useWebSocket from './hooks/useWebSocket';

// Función para generar color desde string
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

// Badge personalizado para usuarios en línea
const OnlineBadge = ({ user }) => (
  <Badge
    overlap="circular"
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    badgeContent={
      <FiberManualRecord 
        sx={{ 
          fontSize: 12, 
          color: '#44b700',
          backgroundColor: 'white',
          borderRadius: '50%',
        }} 
      />
    }
  >
    <Avatar
      alt={user.name}
      src={user.image ? `http://127.0.0.1:8000${user.image}` : undefined}
      sx={{
        bgcolor: user.image ? undefined : stringToColor(user.name),
        width: 32,
        height: 32,
        fontSize: '0.875rem',
        border: '2px solid white',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.15)',
          zIndex: 10
        }
      }}
    >
      {!user.image && user.initials}
    </Avatar>
  </Badge>
);

const Navbar = ({ onMenuClick, drawerWidth = 280 }) => {
  
  const dispatch = useDispatch();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [usersAnchor, setUsersAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // WebSocket para usuarios en línea
  const usersWS = useWebSocket('/ws/users/online/');
  const [connectedUsers, setConnectedUsers] = useState([]);

  // Solicitar usuarios conectados al establecer conexión
  useEffect(() => {
    if (usersWS.isConnected) {
      setTimeout(() => {
        usersWS.sendMessage({ type: 'get_connected_users' });
      }, 500);
    }
  }, [usersWS.isConnected]);

  // Manejar mensajes del WebSocket de usuarios
  useEffect(() => {
    if (!usersWS.lastMessage) return;

    const msg = usersWS.lastMessage;

    switch (msg.type) {
      case 'connection_established':
        console.log('✅ Conectado a usuarios en línea');
        break;

      case 'users_update':
        console.log(`👥 Usuarios conectados: ${msg.total}`, msg.users);
        setConnectedUsers(msg.users || []);
        break;

      case 'user_connected':
        console.log(`✅ ${msg.user.name} se conectó`);
        break;

      case 'user_disconnected':
        console.log(`❌ ${msg.user.name} se desconectó`);
        break;

      default:
        break;
    }
  }, [usersWS.lastMessage]);

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

  const handleUsersOpen = (event) => {
    setUsersAnchor(event.currentTarget);
  };

  const handleUsersClose = () => {
    setUsersAnchor(null);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    dispatch(actionLogout());
    handleProfileMenuClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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

          {/* Toggle Dark Mode 
          <IconButton
            className="navbar-icon-button"
            color="inherit"
            onClick={toggleDarkMode}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          */}

          {/* Mensajes 
          <IconButton className="navbar-icon-button" color="inherit">
            <Badge badgeContent={4} color="error">
              <Email />
            </Badge>
          </IconButton>
          */}

          {/* Notificaciones
          <IconButton
            className="navbar-icon-button"
            color="inherit"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={12} color="error">
              <Notifications />
            </Badge>
          </IconButton>
           */}

          {/* Usuarios en línea */}
          <Tooltip title={`${connectedUsers.length} usuario(s) en línea`} arrow>
            <IconButton
              className="navbar-icon-button"
              color="inherit"
              onClick={handleUsersOpen}
              sx={{ 
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Badge 
                badgeContent={connectedUsers.length} 
                color="success"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#44b700',
                    color: 'white',
                    fontWeight: 'bold',
                    animation: connectedUsers.length > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 }
                    }
                  }
                }}
              >
                <People />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Avatares de usuarios conectados (solo desktop) */}
          {!isMobile && connectedUsers.length > 0 && (
            <Box 
              onClick={handleUsersOpen}
              sx={{ 
                cursor: 'pointer',
                ml: 1,
                mr: 1,
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <AvatarGroup 
                max={3}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    border: '2px solid white'
                  }
                }}
              >
                {connectedUsers.slice(0, 3).map((user) => (
                  <Tooltip 
                    key={user.id} 
                    title={`${user.name} - ${user.role_display}`}
                    arrow
                  >
                    <OnlineBadge user={user} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
          )}

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

        {/* Menú de Usuarios en Línea */}
        <Menu
          anchorEl={usersAnchor}
          open={Boolean(usersAnchor)}
          onClose={handleUsersClose}
          className="navbar-menu"
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              minWidth: 320,
              maxWidth: 400,
              maxHeight: 500
            }
          }}
        >
          <Box className="navbar-menu-header" sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: '#f5f5f5'
          }}>
            <Box display="flex" alignItems="center" gap={1}>
              <People color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Usuarios en Línea
              </Typography>
            </Box>
            <Chip 
              label={connectedUsers.length} 
              size="small" 
              color="success"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <Divider />
          
          {connectedUsers.length > 0 ? (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {connectedUsers.map((user) => (
                <MenuItem 
                  key={user.id} 
                  onClick={handleUsersClose}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 168, 89, 0.08)'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <OnlineBadge user={user} />
                    
                    <Box flex={1} minWidth={0}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        noWrap
                      >
                        {user.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Chip 
                          label={user.role_display} 
                          size="small"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem',
                            fontWeight: 600
                          }}
                          color={
                            user.role === 'admin' ? 'error' :
                            user.role === 'vendedor' ? 'primary' :
                            user.role === 'contador' ? 'warning' : 'default'
                          }
                        />
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          noWrap
                          sx={{ maxWidth: 150 }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <FiberManualRecord 
                      sx={{ 
                        fontSize: 12, 
                        color: '#44b700',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 }
                        }
                      }} 
                    />
                  </Box>
                </MenuItem>
              ))}
            </Box>
          ) : (
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
              <People sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">
                No hay usuarios conectados
              </Typography>
            </Box>
          )}
        </Menu>

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