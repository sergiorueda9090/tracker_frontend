import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './styles/Layout.css';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 280;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box className="layout-container">
      {/* Navbar */}
      <Navbar onMenuClick={handleDrawerToggle} drawerWidth={drawerWidth} />

      {/* Sidebar */}
      <Sidebar 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
        drawerWidth={drawerWidth}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        className="layout-main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          mt: '70px', // Altura del navbar
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;