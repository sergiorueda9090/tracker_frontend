import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  Alert,
  TablePagination,
} from '@mui/material';
import {
  Edit,
  Delete,
  Lock,
  LockOpen,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk, updateThunks } from "../../store/userStore/userThunks";
import { showAlert } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector(state => state.userStore);
  
  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleToggleActive = (user) => {
    const newActiveState = user.is_active ? 0 : 1;
    
    dispatch(showAlert({
      type: "warning",
      title: user.is_active ? "⚠️ Desactivar Usuario" : "✅ Activar Usuario",
      text: user.is_active 
        ? `¿Está seguro que desea desactivar al usuario "${user.username}"? El usuario no podrá acceder al sistema hasta que sea activado nuevamente.`
        : `¿Está seguro que desea activar al usuario "${user.username}"? El usuario podrá acceder al sistema inmediatamente.`,
      confirmText: user.is_active ? "Sí, desactivar usuario" : "Sí, activar usuario",
      cancelText: "Cancelar",
      action: () => {
        const formData = new FormData();
        formData.append('is_active', newActiveState);
        dispatch(updateThunks(user.id, formData));
      }
    }));
  };
  
  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (usuario) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar al usuario "${usuario.username}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar usuario",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(usuario.id));
      }
    }));
  };

  // Mostrar error
  if (error) {
    return (
      <Paper className="page-paper">
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  // Validar si users es un array
  if (!Array.isArray(users)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de usuarios no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay usuarios
  if (users.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay usuarios registrados
          </Typography>
        </Box>
      </Paper>
    );
  }


  return (
    <Paper className="page-paper">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell><strong>Nombre Completo</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Rol</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((usuario) => (
              <TableRow key={usuario.id} className="table-row">
                <TableCell>{usuario.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {usuario.username}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {usuario.first_name || usuario.last_name 
                      ? `${usuario.first_name} ${usuario.last_name}`.trim()
                      : 'Sin nombre'
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {usuario.email}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={
                      usuario.role === 'admin' || usuario.role === 'administrador' ? 'Administrador' :
                      usuario.role === 'vendedor' ? 'Vendedor' :
                      usuario.role === 'contador' ? 'Contador' :
                      'Cliente'
                    } 
                    size="small" 
                    color={
                      usuario.role === 'admin' || usuario.role === 'administrador' ? 'error' : 
                      usuario.role === 'vendedor' ? 'primary' :
                      usuario.role === 'contador' ? 'secondary' :
                      'default'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={usuario.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={usuario.is_active ? 'success' : 'default'}
                    icon={usuario.is_active ? <LockOpen /> : <Lock />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleShowRecord(usuario.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={usuario.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton 
                        size="small" 
                        color={usuario.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleActive(usuario)}
                      >
                        {usuario.is_active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(usuario)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Componente de Paginación */}
       <Pagination/>
    </Paper>
  );
};

export default MainTable;