import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, IconButton, Divider } from '@mui/material';
import { Edit, Delete, Lock, LockOpen, Assignment, AccountCircle, TrendingUp } from '@mui/icons-material';

const MainGrid = ({ transito_tarifas, onEdit, onDelete, onToggleActive }) => {
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

  return (
    <Grid container spacing={3}>
      {transito_tarifas.map((tarifa) => (
        <Grid item xs={12} sm={6} md={4} key={tarifa.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h6" component="div" fontWeight={600}>
                  <Assignment fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {tarifa.tramite__nombre}
                </Typography>
                <Chip
                  label={tarifa.is_active ? 'Activo' : 'Inactivo'}
                  size="small"
                  color={tarifa.is_active ? 'success' : 'default'}
                  icon={tarifa.is_active ? <LockOpen /> : <Lock />}
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                  <AccountCircle fontSize="small" />
                  <strong>{tarifa.proveedor__codigo_encargado}</strong> - {tarifa.proveedor__nombre}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Servicio Proveedor:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatPrice(tarifa.servicio_proveedor)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Servicio Empresa:</Typography>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {formatPrice(tarifa.servicio_empresa)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ backgroundColor: 'rgba(0, 168, 89, 0.1)', p: 1, borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    <TrendingUp fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Margen:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    {formatPrice(calcularMargen(tarifa.servicio_proveedor, tarifa.servicio_empresa))}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={1} mt={2} justifyContent="flex-end">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(tarifa)}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color={tarifa.is_active ? 'warning' : 'success'}
                  onClick={() => onToggleActive(tarifa)}
                >
                  {tarifa.is_active ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(tarifa)}
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
