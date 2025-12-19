import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  Dashboard,
  ShoppingCart,
  Inventory,
  People,
  Assessment,
  Settings,
  ExitToApp,
  ChevronLeft,
  LocalOffer,
  Category,
  Person,
  Receipt,
  Business,
  HourglassEmpty,
  TrackChanges,
  Archive,
  Description,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Sidebar.css';

import { actionLogout } from "./store/authStore/authThunks";
import { useDispatch } from 'react-redux';

const Sidebar = ({ open, onClose, drawerWidth = 280 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Usuarios', icon: <People />, path: '/usuarios' },
    { text: 'Proveedores', icon: <Business />, path: '/proveedores' },
    
    { text: 'En Preparación', icon: <HourglassEmpty />, path: '/preparacion' },
    { text: 'Tracker', icon: <TrackChanges />, path: '/tracker' },
    { text: 'Archivados', icon: <Archive />, path: '/archivados' },
    { text: 'Facturación', icon: <Receipt />, path: '/facturacion' },
  ];

  const bottomMenuItems = [
    { text: 'Configuración', icon: <Settings />, path: '/settings' },
    { text: 'Cerrar Sesión', icon: <ExitToApp />, path: '/logout' },
  ];

  const handleNavigation = (path) => {
    if (path === '/logout') {
      // Aquí va tu lógica de logout
      console.log('Cerrando sesión...');
      dispatch(actionLogout());

    } else {
      navigate(path);
    }
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box className="sidebar-container">
      {/* Header del Sidebar */}
      <Box className="sidebar-header">
        <Box className="sidebar-logo-section">
          <Box className="sidebar-logo">
            <TrackChanges className="sidebar-logo-icon" />
          </Box>
          <Box>
            <Typography variant="h6" className="sidebar-title">
              Tracker
            </Typography>
            <Typography variant="caption" className="sidebar-subtitle">
              Gestión de Trámites
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} className="sidebar-close-button">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider className="sidebar-divider" />

      {/* Perfil del Usuario */}
      <Box className="sidebar-profile">
        <Avatar className="sidebar-avatar" alt="Admin User">
          A
        </Avatar>
        <Box className="sidebar-profile-info">
          <Typography variant="subtitle2" className="sidebar-profile-name">
            Admin User
          </Typography>
          <Typography variant="caption" className="sidebar-profile-role">
            Administrador
          </Typography>
        </Box>
      </Box>

      <Divider className="sidebar-divider" />

      {/* Menú Principal */}
      <List className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding className="sidebar-menu-item">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                className={`sidebar-menu-button ${isActive ? 'active' : ''}`}
              >
                <ListItemIcon className={`sidebar-menu-icon ${isActive ? 'active' : ''}`}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  className={`sidebar-menu-text ${isActive ? 'active' : ''}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Menú Inferior */}
      <Box className="sidebar-bottom-menu">
        <Divider className="sidebar-divider" />
        <List>
          {bottomMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding className="sidebar-menu-item">
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar-menu-button ${isActive ? 'active' : ''}`}
                >
                  <ListItemIcon className={`sidebar-menu-icon ${isActive ? 'active' : ''}`}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    className={`sidebar-menu-text ${isActive ? 'active' : ''}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar - Permanente */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          className="sidebar-drawer-desktop"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Sidebar - Temporal */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          className="sidebar-drawer-mobile"
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en móvil
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;