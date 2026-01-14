import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Receipt, Info } from '@mui/icons-material';
import { obtenerFacturasProcesadas } from '../data/mockData';

const MainHeader = () => {
  const facturas = obtenerFacturasProcesadas();
  const facturasPendientes = facturas.filter(f => f.estado === 'pendiente').length;
  const facturasEnviadas = facturas.filter(f => f.estado === 'enviada').length;

  return (
    <Box className="page-header-actions">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Receipt sx={{ fontSize: 40, color: '#00A859' }} />
        <Box>
          <Typography variant="h4" className="page-title">
            Facturación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión y envío de facturas a Siigo
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip
          label={`${facturasPendientes} Pendientes`}
          color="warning"
          variant="outlined"
        />
        <Chip
          label={`${facturasEnviadas} Enviadas`}
          color="success"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default MainHeader;
