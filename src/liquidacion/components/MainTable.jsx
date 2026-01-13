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
  Tooltip,
  Box,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks } from "../../store/finalizadosStore/finalizadosThunks";
import { openModalShared, closeModalShared } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';
import MainDialog from './MainDialog';

const MainTable = () => {
  const dispatch = useDispatch();
  const { finalizados, error } = useSelector(state => state.finalizadosStore);
  const [selectedTramite, setSelectedTramite] = useState(null);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleViewLiquidacion = (tramite) => {
    // Preparar datos para el dialog
    const tramiteData = {
      id: tramite.id,
      placa: tramite.placa,
      tramite_nombre: tramite.tramite_nombre || tramite.tipo_tramite,
      precio: tramite.precio || tramite.tramite_precio || 0,
      servicio_empresa: tramite.servicio_empresa || 0,
      servicio_proveedor: tramite.servicio_proveedor || 0,
      proveedor_nombre: tramite.proveedor_nombre || tramite.proveedor__nombre,
      municipio_nombre: tramite.municipio_nombre || tramite.municipio__nombre,
      transporte: tramite.transporte || 0,
      bonificacion: tramite.bonificacion || 0,
      anticipos: tramite.anticipos || 0,
    };

    setSelectedTramite(tramiteData);
    dispatch(openModalShared());
  };

  // Formatear precio en pesos colombianos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price || 0);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  // Validar si finalizados es un array
  if (!Array.isArray(finalizados)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de trámites finalizados no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay finalizados
  if (finalizados.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay trámites finalizados para liquidar
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <>
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
                <TableCell align="right"><strong>Precio Trámite</strong></TableCell>
                <TableCell align="right"><strong>Servicio Empresa</strong></TableCell>
                <TableCell align="center"><strong>Fecha Finalizado</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalizados.map((tramite) => (
                <TableRow key={tramite.id} className="table-row">
                  <TableCell>{tramite.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {tramite.placa || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tramite.tramite_nombre || tramite.tipo_tramite || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tramite.proveedor_nombre || tramite.proveedor__nombre || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tramite.municipio_nombre || tramite.municipio__nombre || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {formatPrice(tramite.precio || tramite.tramite_precio)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(tramite.servicio_empresa)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(tramite.fecha_finalizado || tramite.updated_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label="Finalizado"
                      size="small"
                      color="success"
                      icon={<CheckCircle />}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Liquidación">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewLiquidacion(tramite)}
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

      {/* Dialog de liquidación */}
      {selectedTramite && (
        <MainDialog
         
          onClose={() => {
            setSelectedTramite(null);
            dispatch(closeModalShared());
          }}
          tramiteData={selectedTramite}
        />
      )}
    </>
  );
};

export default MainTable;
