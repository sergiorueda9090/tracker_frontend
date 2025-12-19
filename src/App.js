import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes
import Login from './Login';
import Layout from './Layout';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider as ThemeProviderSetting  } from './context/ThemeContext'; // ⭐ IMPORTANTE

// Tema personalizado - Tracker
const theme = createTheme({
  palette: {
    primary: {
      main: '#00A859',
      light: '#33B976',
      dark: '#008A47',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    success: {
      main: '#00A859',
      light: '#33B976',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProviderSetting>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Ruta de Login */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas del Dashboard con Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <AppRoutes />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProviderSetting>
  );
}

export default App;