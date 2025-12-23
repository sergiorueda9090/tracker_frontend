import React from 'react';
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
import Settings   from '../pages/Settings';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  // Aquí implementarías tu lógica de autenticación
  const { isLogin } = useSelector((state) => state.authStore || {});

  if (!isLogin) {
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