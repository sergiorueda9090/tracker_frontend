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
          Tránsitos Tarifas
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        className="action-button"
        onClick={onAddNew}
      >
        Nueva Tarifa
      </Button>
    </Box>
  );
};

export default MainHeader;
