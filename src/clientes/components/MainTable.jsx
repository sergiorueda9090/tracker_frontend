import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  Edit,
  Delete,
  Lock,
  LockOpen,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk, updateThunks } from "../../store/clienteStore/clienteThunks";
import { showAlert } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { clientes, error } = useSelector(state => state.clienteStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleToggleActive = (cliente) => {
    const newActiveState = !cliente.is_active;

    dispatch(showAlert({
      type: "warning",
      title: cliente.is_active ? "⚠️ Desactivar Cliente" : "✅ Activar Cliente",
      text: cliente.is_active
        ? `¿Está seguro que desea desactivar al cliente "${cliente.nombre}"? El cliente no estará disponible hasta que sea activado nuevamente.`
        : `¿Está seguro que desea activar al cliente "${cliente.nombre}"? El cliente estará disponible inmediatamente.`,
      confirmText: cliente.is_active ? "Sí, desactivar cliente" : "Sí, activar cliente",
      cancelText: "Cancelar",
      action: () => {
        const data = {
          nombre: cliente.nombre,
          razon_social: cliente.razon_social,
          nit: cliente.nit,
          departamento_id: cliente.departamento_id,
          ciudad_id: cliente.ciudad_id,
          is_active: newActiveState ? 1 : 0
        };
        dispatch(updateThunks(cliente.id, data));
      }
    }));
  };

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (cliente) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar al cliente "${cliente.nombre}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar cliente",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(cliente.id));
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

  // Validar si clientes es un array
  if (!Array.isArray(clientes)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de clientes no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay clientes
  if (clientes.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay clientes registrados
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
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Razón Social</strong></TableCell>
              <TableCell><strong>NIT</strong></TableCell>
              <TableCell><strong>Departamento</strong></TableCell>
              <TableCell><strong>Ciudad</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id} className="table-row">
                <TableCell>{cliente.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {cliente.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.razon_social}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {cliente.nit}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.departamento__departamento || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.ciudad__municipio || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={cliente.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={cliente.is_active ? 'success' : 'default'}
                    icon={cliente.is_active ? <LockOpen /> : <Lock />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleShowRecord(cliente.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={cliente.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        color={cliente.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleActive(cliente)}
                      >
                        {cliente.is_active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(cliente)}
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
      <Pagination />
    </Paper>
  );
};

export default MainTable;
