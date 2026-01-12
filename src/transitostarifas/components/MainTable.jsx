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
  TrendingUp,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk, updateThunks } from "../../store/transitosTarifasStore/transitosTarifasThunks";
import { showAlert } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { transito_tarifas, error } = useSelector(state => state.transitosTarifasStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleToggleActive = (tarifa) => {
    const newActiveState = !tarifa.is_active;

    dispatch(showAlert({
      type: "warning",
      title: tarifa.is_active ? "⚠️ Desactivar Tarifa" : "✅ Activar Tarifa",
      text: tarifa.is_active
        ? `¿Está seguro que desea desactivar esta tarifa? La tarifa no estará disponible hasta que sea activada nuevamente.`
        : `¿Está seguro que desea activar esta tarifa? La tarifa estará disponible inmediatamente.`,
      confirmText: tarifa.is_active ? "Sí, desactivar tarifa" : "Sí, activar tarifa",
      cancelText: "Cancelar",
      action: () => {
        const data = {
          tramite_id: tarifa.tramite_id,
          proveedor_id: tarifa.proveedor_id,
          servicio_proveedor: tarifa.servicio_proveedor,
          servicio_empresa: tarifa.servicio_empresa,
          is_active: newActiveState ? 1 : 0
        };
        dispatch(updateThunks(tarifa.id, data));
      }
    }));
  };

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (tarifa) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar esta tarifa? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar tarifa",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(tarifa.id));
      }
    }));
  };

  // Formatear precio en pesos colombianos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Calcular margen
  const calcularMargen = (servicio_proveedor, servicio_empresa) => {
    return parseFloat(servicio_empresa) - parseFloat(servicio_proveedor);
  };

  // Calcular porcentaje de margen
  const calcularPorcentajeMargen = (servicio_proveedor, servicio_empresa) => {
    const prov = parseFloat(servicio_proveedor);
    const margen = calcularMargen(servicio_proveedor, servicio_empresa);
    if (prov > 0) {
      return ((margen / prov) * 100).toFixed(2);
    }
    return 0;
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay tránsitos tarifas registrados
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
              <TableCell><strong>Trámite</strong></TableCell>
              <TableCell><strong>Proveedor</strong></TableCell>
              <TableCell align="right"><strong>Servicio Proveedor</strong></TableCell>
              <TableCell align="right"><strong>Servicio Empresa</strong></TableCell>
              <TableCell align="right"><strong>Margen</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transito_tarifas.map((tarifa) => (
              <TableRow key={tarifa.id} className="table-row">
                <TableCell>{tarifa.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {tarifa.tramite__nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    <strong>{tarifa.proveedor__codigo_encargado}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tarifa.proveedor__nombre}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(tarifa.servicio_proveedor)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {formatPrice(tarifa.servicio_empresa)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatPrice(calcularMargen(tarifa.servicio_proveedor, tarifa.servicio_empresa))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUp fontSize="inherit" />
                      {calcularPorcentajeMargen(tarifa.servicio_proveedor, tarifa.servicio_empresa)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={tarifa.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={tarifa.is_active ? 'success' : 'default'}
                    icon={tarifa.is_active ? <LockOpen /> : <Lock />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleShowRecord(tarifa.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={tarifa.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        color={tarifa.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleActive(tarifa)}
                      >
                        {tarifa.is_active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
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
