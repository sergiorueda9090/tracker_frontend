import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Páginas del Dashboard
import Dashboard  from '../pages/Dashboard';
import Usuarios   from '../usuarios/Main';
import Proveedores from '../proveedores/Main';

import Preparacion from '../preparacion/Main';
import PreparacionHistory from '../preparacion/History';

import Tracker from '../tracker/Main';
import TrackerHistory from '../tracker/History';

import Finalizados from '../finalizados/Main';
import FinalizadosHistory from '../finalizados/History';

import Archivadas from '../archivadas/Main';
import ArchivadaHistory from '../archivadas/History';

import Settings   from '../pages/Settings';

// Importar acción de logout
import { actionLogout } from '../store/authStore/authThunks';

// Importar utilidades de token
import { isTokenExpired } from '../utils/tokenUtils';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isLogin, token } = useSelector((state) => state.authStore || {});

  useEffect(() => {
    // Verificar si el token ha expirado
    if (token && isTokenExpired(token)) {
      console.log('🔒 Token expirado. Cerrando sesión...');

      // Limpiar localStorage completamente
      localStorage.clear();

      // Hacer logout en Redux
      dispatch(actionLogout());
    }
  }, [token, dispatch]);

  // Si no está logueado, redirigir al login
  if (!isLogin) {
    return <Navigate to="/" replace />;
  }

  // Si el token está expirado, redirigir al login
  if (token && isTokenExpired(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal del dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />

      <Route
        path="/proveedores"
        element={
          <ProtectedRoute>
            <Proveedores />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preparacion"
        element={
          <ProtectedRoute>
            <Preparacion />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preparacion/history/:id"
        element={
          <ProtectedRoute>
            <PreparacionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracker"
        element={
          <ProtectedRoute>
            <Tracker />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracker/history/:id"
        element={
          <ProtectedRoute>
            <TrackerHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/finalizados"
        element={
          <ProtectedRoute>
            <Finalizados />
          </ProtectedRoute>
        }
      />

      <Route
        path="/finalizados/history/:id"
        element={
          <ProtectedRoute>
            <FinalizadosHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/archivadas"
        element={
          <ProtectedRoute>
            <Archivadas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/archivadas/history/:id"
        element={
          <ProtectedRoute>
            <ArchivadaHistory />
          </ProtectedRoute>
        }
      />

      {/* Clientes
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />*/}


      {/* Configuración */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;