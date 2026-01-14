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
import { getAllThunks, showThunk, deleteThunk, updateThunks } from "../../store/tramitesStore/tramitesThunks";
import { showAlert } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { tramites, error } = useSelector(state => state.tramitesStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleToggleActive = (tramite) => {
    const newActiveState = !tramite.is_active;

    dispatch(showAlert({
      type: "warning",
      title: tramite.is_active ? "⚠️ Desactivar Trámite" : "✅ Activar Trámite",
      text: tramite.is_active
        ? `¿Está seguro que desea desactivar el trámite "${tramite.nombre}"? El trámite no estará disponible hasta que sea activado nuevamente.`
        : `¿Está seguro que desea activar el trámite "${tramite.nombre}"? El trámite estará disponible inmediatamente.`,
      confirmText: tramite.is_active ? "Sí, desactivar trámite" : "Sí, activar trámite",
      cancelText: "Cancelar",
      action: () => {
        const data = {
          nombre: tramite.nombre,
          descripcion: tramite.descripcion,
          is_active: newActiveState ? 1 : 0
        };
        dispatch(updateThunks(tramite.id, data));
      }
    }));
  };

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (tramite) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar el trámite "${tramite.nombre}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar trámite",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(tramite.id));
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

  // Validar si tramites es un array
  if (!Array.isArray(tramites)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de trámites no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay tramites
  if (tramites.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay trámites registrados
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
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tramites.map((tramite) => (
              <TableRow key={tramite.id} className="table-row">
                <TableCell>{tramite.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {tramite.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tramite.descripcion || 'Sin descripción'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={tramite.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={tramite.is_active ? 'success' : 'default'}
                    icon={tramite.is_active ? <LockOpen /> : <Lock />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleShowRecord(tramite.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={tramite.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        color={tramite.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleActive(tramite)}
                      >
                        {tramite.is_active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(tramite)}
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
