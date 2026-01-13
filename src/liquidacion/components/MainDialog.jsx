import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Receipt,
  AccountCircle,
  TrendingUp,
  Close,
  Print,
  LocationOn,
  DirectionsCar,
} from '@mui/icons-material';

// Importar funciones de cálculo
import {
  calcularIVA,
  calcularTotalFacturacion,
  calcularTotalServicioGestor,
  calcularUtilidad,
  formatCurrency,
  formatDate,
} from '../data/mockData';

const MainDialog = ({ open, onClose, tramiteData }) => {
  if (!tramiteData) return null;

  // Cálculos
  const iva = calcularIVA(tramiteData.servicio_empresa);
  const totalFacturacion = calcularTotalFacturacion(tramiteData);
  const totalFacturacionSinIVA = tramiteData.tramite_precio + tramiteData.servicio_empresa;
  const totalServicioGestor = calcularTotalServicioGestor(tramiteData);
  const utilidad = calcularUtilidad(tramiteData);

  // Estilo para las filas de conceptos
  const conceptoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: 1.5,
    px: 2,
    borderRadius: 1,
    mb: 1,
    backgroundColor: 'rgba(0, 168, 89, 0.03)',
    '&:hover': {
      backgroundColor: 'rgba(0, 168, 89, 0.06)',
    },
  };

  const totalRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: 2,
    px: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(0, 168, 89, 0.1)',
    border: '2px solid rgba(0, 168, 89, 0.3)',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          color: '#00A859',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '2px solid rgba(0, 168, 89, 0.2)',
        }}
      >
        <Receipt />
        Liquidación - Trámite Finalizado
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#F8FAFC' }}>
        {/* Información general del trámite */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DirectionsCar color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary">
                  Placa:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {tramiteData.placa}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Trámite: <strong>{tramiteData.tramite_nombre}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha finalizado: <strong>{formatDate(tramiteData.fecha_finalizado)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountCircle color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary">
                  Gestor:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {tramiteData.proveedor_nombre}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {tramiteData.municipio_nombre}, {tramiteData.departamento_nombre}
                </Typography>
              </Box>
              <Chip
                label="Finalizado"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Grid de dos columnas */}
        <Grid container spacing={3}>
          {/* 1️⃣ Card: Facturación */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                border: '2px solid rgba(0, 168, 89, 0.2)',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Receipt color="primary" />
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Facturación
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Precio del trámite */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) {tramiteData.tramite_nombre}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(tramiteData.tramite_precio)}
                  </Typography>
                </Box>

                {/* Servicio empresa */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Servicio Empresa
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(tramiteData.servicio_empresa)}
                  </Typography>
                </Box>

                {/* IVA */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) IVA Servicio Empresa (19%)
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="warning.main">
                    {formatCurrency(iva)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total Facturación */}
                <Box sx={totalRowStyle}>
                  <Typography variant="h6" fontWeight={700}>
                    Total Facturación
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {formatCurrency(totalFacturacion)}
                  </Typography>
                </Box>

                {/* Subtotal sin IVA */}
                <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Subtotal sin IVA: <strong>{formatCurrency(totalFacturacionSinIVA)}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 2️⃣ Card: Servicio Gestor */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                border: '2px solid rgba(0, 168, 89, 0.2)',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AccountCircle color="primary" />
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Servicio Gestor
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Información del gestor */}
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(0, 168, 89, 0.05)', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Gestor: <strong>{tramiteData.proveedor_nombre}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Código: <strong>{tramiteData.proveedor_codigo}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Municipio: <strong>{tramiteData.municipio_nombre}</strong>
                  </Typography>
                </Box>

                {/* Conceptos económicos */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Servicio Gestor
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(tramiteData.servicio_proveedor)}
                  </Typography>
                </Box>

                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Transporte / Envíos
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(tramiteData.transporte)}
                  </Typography>
                </Box>

                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Bonificación
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(tramiteData.bonificacion)}
                  </Typography>
                </Box>

                <Box sx={{
                  ...conceptoRowStyle,
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                }}>
                  <Typography variant="body1" color="text.secondary">
                    (-) Anticipos
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="error">
                    {formatCurrency(tramiteData.anticipos)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total Servicio Gestor */}
                <Box sx={totalRowStyle}>
                  <Typography variant="h6" fontWeight={700}>
                    Total Servicio Gestor
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {formatCurrency(totalServicioGestor)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 📊 Cálculo de Utilidad */}
        <Box
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: utilidad >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: utilidad >= 0 ? '3px solid rgba(34, 197, 94, 0.4)' : '3px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <TrendingUp color={utilidad >= 0 ? 'success' : 'error'} fontSize="large" />
            <Typography variant="h5" fontWeight={700} color={utilidad >= 0 ? 'success.main' : 'error.main'}>
              UTILIDAD
            </Typography>
          </Box>

          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 2 }}>
            Total Facturación (sin IVA) - Total Servicio Gestor
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Facturación sin IVA
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(totalFacturacionSinIVA)}
              </Typography>
            </Box>

            <Typography variant="h4" color="text.secondary">-</Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Servicio Gestor
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(totalServicioGestor)}
              </Typography>
            </Box>

            <Typography variant="h4" color="text.secondary">=</Typography>

            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 2,
                minWidth: 200,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                UTILIDAD FINAL
              </Typography>
              <Typography
                variant="h4"
                fontWeight={900}
                color={utilidad >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(utilidad)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          startIcon={<Print />}
          variant="outlined"
          color="primary"
          onClick={() => window.print()}
        >
          Imprimir
        </Button>
        <Button
          startIcon={<Close />}
          variant="contained"
          onClick={onClose}
          sx={{
            background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
