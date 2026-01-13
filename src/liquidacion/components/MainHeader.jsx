import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { Receipt } from '@mui/icons-material';

const MainHeader = () => {
  return (
    <Box className="page-header-actions">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Receipt sx={{ fontSize: 40, color: '#00A859' }} />
        <Box>
          <Typography variant="h4" className="page-title">
            Liquidación de Trámites
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualiza la liquidación de trámites finalizados
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainHeader;
