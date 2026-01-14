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
  Chip,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import {
  Visibility,
  Send,
  CheckCircle,
} from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { openModalShared, closeModalShared } from "../../store/globalStore/globalStore";
import Pagination from './Pagination';
import MainDialog from './MainDialog';

// Importar datos mock y funciones
import {
  obtenerFacturasProcesadas,
  formatCurrency,
  formatDate,
  getEstadoColor,
  getEstadoLabel,
} from '../data/mockData';

const MainTable = () => {
  const dispatch = useDispatch();
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Obtener facturas procesadas (con cálculos automáticos)
  const facturas = obtenerFacturasProcesadas();

  const handleViewFactura = (factura) => {
    setSelectedFactura(factura);
    setOpenDialog(true);
    dispatch(openModalShared());
  };

  const handleCloseDialog = () => {
    setSelectedFactura(null);
    setOpenDialog(false);
    dispatch(closeModalShared());
  };

  // Validar si hay facturas
  if (!facturas || facturas.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay facturas pendientes
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
                <TableCell><strong>ID Factura</strong></TableCell>
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Documento</strong></TableCell>
                <TableCell><strong>Trámite</strong></TableCell>
                <TableCell><strong>Placa</strong></TableCell>
                <TableCell align="right"><strong>Subtotal</strong></TableCell>
                <TableCell align="right"><strong>IVA</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Fecha</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow
                  key={factura.factura_id}
                  className="table-row"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 168, 89, 0.05)',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {factura.factura_id}
                    </Typography>
                    {factura.numero_factura && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {factura.numero_factura}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {factura.cliente.razon_social || factura.cliente.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {factura.cliente.municipio}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {factura.cliente.tipo_documento}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {factura.cliente.numero_documento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {factura.tramite.tipo_tramite}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {factura.tramite.numero_tramite}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={factura.tramite.placa}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(factura.valores.subtotal)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="warning.main">
                      {formatCurrency(factura.valores.iva_monto)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color="primary">
                      {formatCurrency(factura.valores.total)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(factura.fecha_creacion)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getEstadoLabel(factura.estado)}
                      size="small"
                      color={getEstadoColor(factura.estado)}
                      icon={factura.estado === 'enviada' ? <CheckCircle /> : factura.estado === 'pendiente' ? <Send /> : null}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Ver Factura">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewFactura(factura)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {factura.estado === 'pendiente' && (
                        <Tooltip title="Enviar a Siigo">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleViewFactura(factura)}
                          >
                            <Send fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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

      {/* Dialog de factura */}
      {selectedFactura && (
        <MainDialog
          open={openDialog}
          onClose={handleCloseDialog}
          facturaData={selectedFactura}
        />
      )}
    </>
  );
};

export default MainTable;
