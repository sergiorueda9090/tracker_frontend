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
  LocationOn,
  Assignment,
  Visibility,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk } from "../../store/transitosTarifasStore/transitosTarifasThunks";
import { openModalShared, showAlert } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { transito_tarifas, error } = useSelector(state => state.transitosTarifasStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (tarifa) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar la configuración de "${tarifa.departamento_nombre} - ${tarifa.municipio_nombre}"? Esta acción eliminará todos los trámites y gestores asociados y no se podrá deshacer.`,
      confirmText: "Sí, eliminar configuración",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(tarifa.id));
      }
    }));
  };

  const handleCreate = () => {
    dispatch(openModalShared());
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mostrar error
  if (error) {
    return (
      <Paper className="page-paper">
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  // Validar si transito_tarifas es un array
  if (!Array.isArray(transito_tarifas)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de tránsitos tarifas no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay tarifas
  if (transito_tarifas.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={400} gap={2}>
          <LocationOn sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            No hay configuraciones de tarifas registradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agregue una nueva configuración por departamento y municipio
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
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 700, color: '#00A859' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#00A859' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" />
                  Ubicación
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#00A859' }}>Departamento</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#00A859' }}>Municipio</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#00A859' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Assignment fontSize="small" />
                  Trámites
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#00A859' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#00A859' }}>Fecha Creación</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#00A859' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transito_tarifas.map((tarifa) => (
              <TableRow
                key={tarifa.id}
                className="table-row"
                sx={{
                  '&:hover': {
                    backgroundColor: '#f8fef9',
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    #{tarifa.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: '#00A859', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {tarifa.departamento_nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tarifa.municipio_nombre}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {tarifa.departamento_nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {tarifa.municipio_nombre}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`${tarifa.total_tramites || 0} ${tarifa.total_tramites === 1 ? 'Trámite' : 'Trámites'}`}
                    size="small"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      fontWeight: 600,
                      borderRadius: '16px',
                    }}
                    icon={<Assignment sx={{ fontSize: 16 }} />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={tarifa.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={tarifa.is_active ? 'success' : 'default'}
                    sx={{
                      fontWeight: 600,
                      borderRadius: '16px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(tarifa.created_at)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons" sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="Ver/Editar Configuración">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#00A859',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 168, 89, 0.08)',
                          }
                        }}
                        onClick={() => handleShowRecord(tarifa.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Detalles">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#1976d2',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          }
                        }}
                        onClick={() => handleShowRecord(tarifa.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Configuración">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#d32f2f',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.08)',
                          }
                        }}
                        onClick={() => handleDelete(tarifa)}
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
