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
  Tooltip,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { getAllThunks, showThunk } from '../../store/liquidacionStore/liquidacionThunks';
import Pagination from './Pagination';

// Formatear moneda
const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const MainTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const { liquidaciones } = useSelector(state => state.liquidacionStore);

  const handleViewLiquidacion = (id) => {
    dispatch(showThunk(id));
  };

  // Obtener chip de estado
  const getEstadoChip = (estado) => {
    const estados = {
      'pendiente': {
        label: 'Pendiente',
        color: 'warning',
        icon: <Warning fontSize="small" />
      },
      'liquidado': {
        label: 'Liquidado',
        color: 'success',
        icon: <CheckCircle fontSize="small" />
      },
      'pagado': {
        label: 'Pagado',
        color: 'info',
        icon: <CheckCircle fontSize="small" />
      },
    };

    const estadoConfig = estados[estado] || estados['pendiente'];

    return (
      <Chip
        label={estadoConfig.label}
        size="small"
        color={estadoConfig.color}
        icon={estadoConfig.icon}
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // Validar si hay liquidaciones
  if (!liquidaciones || liquidaciones.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay liquidaciones disponibles
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
              <TableCell><strong>Placa</strong></TableCell>
              <TableCell><strong>Trámite</strong></TableCell>
              <TableCell><strong>Proveedor/Gestor</strong></TableCell>
              <TableCell><strong>Municipio</strong></TableCell>
              <TableCell align="right"><strong>Derechos Trámite</strong></TableCell>
              <TableCell align="right"><strong>Servicio Empresa</strong></TableCell>
              <TableCell align="right"><strong>Utilidad</strong></TableCell>
              <TableCell align="center"><strong>Fecha Finalizado</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {liquidaciones.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} sx={{ py: 10, textAlign: 'center', borderBottom: 'none' }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No hay datos para mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {liquidaciones.map((liq) => (
              <TableRow
                key={liq.id}
                className="table-row"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 168, 89, 0.05)',
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    #{liq.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {liq.placa}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {liq.tramite_nombre || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {liq.proveedor_nombre || 'Sin asignar'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {liq.proveedor_codigo || ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {liq.municipio_nombre || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {formatCurrency(liq.derechos_tramite)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(liq.servicio_empresa)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {liq.es_rentable ? (
                      <TrendingUp fontSize="small" color="success" />
                    ) : (
                      <TrendingDown fontSize="small" color="error" />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={liq.es_rentable ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(liq.utilidad)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(liq.fecha_finalizado)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {getEstadoChip(liq.estado)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver Liquidación">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewLiquidacion(liq.id)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
