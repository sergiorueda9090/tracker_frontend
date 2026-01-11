import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Edit, Delete, Lock, LockOpen } from '@mui/icons-material';

const MainGrid = ({ tramites, onEdit, onDelete, onToggleActive }) => {
  // Formatear precio en pesos colombianos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Grid container spacing={3}>
      {tramites.map((tramite) => (
        <Grid item xs={12} sm={6} md={4} key={tramite.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h6" component="div" fontWeight={600}>
                  {tramite.nombre}
                </Typography>
                <Chip
                  label={tramite.is_active ? 'Activo' : 'Inactivo'}
                  size="small"
                  color={tramite.is_active ? 'success' : 'default'}
                  icon={tramite.is_active ? <LockOpen /> : <Lock />}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                {tramite.descripcion || 'Sin descripción'}
              </Typography>

              <Typography variant="h5" color="primary" fontWeight={600}>
                {formatPrice(tramite.precio)}
              </Typography>

              <Box display="flex" gap={1} mt={2}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(tramite)}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color={tramite.is_active ? 'warning' : 'success'}
                  onClick={() => onToggleActive(tramite)}
                >
                  {tramite.is_active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(tramite)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MainGrid;
