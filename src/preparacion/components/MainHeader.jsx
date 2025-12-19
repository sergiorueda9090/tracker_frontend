import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const MainHeader = ({ onAddNew }) => {
  return (
    <Box className="page-header-actions">
      <Box>
        <Typography variant="h4" className="page-title">
          En Preparación
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
          Gestión de trámites en proceso de verificación y preparación
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        className="action-button"
        onClick={onAddNew}
      >
        Nuevo Trámite
      </Button>
    </Box>
  );
};

export default MainHeader;
