import React, { useState } from 'react';
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
} from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { openModalShared, closeModalShared } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';
import MainDialog from './MainDialog';

// Importar datos mock
import { mockTramites, formatCurrency, formatDate } from '../data/mockData';

const MainTable = () => {
  const dispatch = useDispatch();
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewLiquidacion = (tramite) => {
    setSelectedTramite(tramite);
    setOpenDialog(true);
    dispatch(openModalShared());
  };

  const handleCloseDialog = () => {
    setSelectedTramite(null);
    setOpenDialog(false);
    dispatch(closeModalShared());
  };

  // Validar si hay trámites
  if (!mockTramites || mockTramites.length === 0) {
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
              {mockTramites.map((tramite) => (
                <TableRow
                  key={tramite.id}
                  className="table-row"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 168, 89, 0.05)',
                    },
                  }}
                >
                  <TableCell>{tramite.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {tramite.placa}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tramite.tramite_nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tramite.proveedor_nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tramite.proveedor_codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tramite.municipio_nombre}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {formatCurrency(tramite.tramite_precio)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(tramite.servicio_empresa)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(tramite.fecha_finalizado)}
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
          open={openDialog}
          onClose={handleCloseDialog}
          tramiteData={selectedTramite}
        />
      )}
    </>
  );
};

export default MainTable;
