import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { Receipt, LocalShipping, CardGiftcard, AccountBalance, TrendingUp } from '@mui/icons-material';

const MainDialog = ({ open, onClose, tramiteData }) => {
  const [transporte, setTransporte] = useState(0);
  const [bonificacion, setBonificacion] = useState(0);
  const [anticipos, setAnticipos] = useState(0);

  // Resetear valores cuando se abre el dialog
  useEffect(() => {
    if (open && tramiteData) {
      setTransporte(tramiteData.transporte || 0);
      setBonificacion(tramiteData.bonificacion || 0);
      setAnticipos(tramiteData.anticipos || 0);
    }
  }, [open, tramiteData]);

  if (!tramiteData) return null;

  // Formatear precio en pesos colombianos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Cálculos del cuadro de Facturación
  const precioTramite = parseFloat(tramiteData.precio || 0);
  const servicioEmpresa = parseFloat(tramiteData.servicio_empresa || 0);
  const ivaServicio = servicioEmpresa * 0.19;
  const totalFacturacion = precioTramite + servicioEmpresa + ivaServicio;
  const totalFacturacionSinIVA = precioTramite + servicioEmpresa;

  // Cálculos del cuadro de Servicio Gestor
  const servicioGestor = parseFloat(tramiteData.servicio_proveedor || 0);
  const transporteValue = parseFloat(transporte) || 0;
  const bonificacionValue = parseFloat(bonificacion) || 0;
  const anticiposValue = parseFloat(anticipos) || 0;
  const totalServicioGestor = servicioGestor + transporteValue + bonificacionValue - anticiposValue;

  // Utilidad
  const utilidad = totalFacturacionSinIVA - totalServicioGestor;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt /> Liquidación - {tramiteData.placa || tramiteData.nombre}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Información del Trámite */}
          <Box>
            <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
              Información del Trámite
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Trámite:</Typography>
                <Typography variant="body1" fontWeight={600}>{tramiteData.tramite_nombre || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Placa:</Typography>
                <Typography variant="body1" fontWeight={600}>{tramiteData.placa || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Gestor:</Typography>
                <Typography variant="body1" fontWeight={600}>{tramiteData.proveedor_nombre || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Municipio:</Typography>
                <Typography variant="body1" fontWeight={600}>{tramiteData.municipio_nombre || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Cuadro 1: Facturación */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(0, 168, 89, 0.05)' }}>
            <Typography variant="h6" color="primary" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt /> Facturación
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  (+) {tramiteData.tramite_nombre || 'Trámite'}:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(precioTramite)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  (+) Servicio Empresa:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(servicioEmpresa)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  (+) IVA Servicio Empresa (19%):
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(ivaServicio)}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between" sx={{ backgroundColor: 'rgba(0, 168, 89, 0.15)', p: 1.5, borderRadius: 1 }}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  Total:
                </Typography>
                <Typography variant="body1" fontWeight={700} color="primary">
                  {formatPrice(totalFacturacion)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Cuadro 2: Servicio Gestor */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
            <Typography variant="h6" sx={{ color: '#F59E0B' }} fontWeight={600} gutterBottom>
              Servicio Gestor
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Gestor:</strong> {tramiteData.proveedor_nombre || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Municipio:</strong> {tramiteData.municipio_nombre || 'N/A'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  (+) Servicio Gestor:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(servicioGestor)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocalShipping fontSize="small" /> (+) Transporte / Envíos:
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={transporte}
                  onChange={(e) => setTransporte(e.target.value)}
                  sx={{ width: 150 }}
                  inputProps={{ min: 0, step: "1000" }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CardGiftcard fontSize="small" /> (+) Bonificación:
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={bonificacion}
                  onChange={(e) => setBonificacion(e.target.value)}
                  sx={{ width: 150 }}
                  inputProps={{ min: 0, step: "1000" }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccountBalance fontSize="small" /> (-) Anticipos:
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={anticipos}
                  onChange={(e) => setAnticipos(e.target.value)}
                  sx={{ width: 150 }}
                  inputProps={{ min: 0, step: "1000" }}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', p: 1.5, borderRadius: 1 }}>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#F59E0B' }}>
                  Total:
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#F59E0B' }}>
                  {formatPrice(totalServicioGestor)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Utilidad */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: utilidad >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: utilidad >= 0 ? '2px solid #22c55e' : '2px solid #ef4444' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight={700} color={utilidad >= 0 ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp /> Utilidad
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  = Total Facturación (sin IVA) - Total Servicio Gestor
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color={utilidad >= 0 ? 'success.main' : 'error.main'}>
                {formatPrice(utilidad)}
              </Typography>
            </Box>
          </Paper>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
            }
          }}
        >
          Imprimir / Exportar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
