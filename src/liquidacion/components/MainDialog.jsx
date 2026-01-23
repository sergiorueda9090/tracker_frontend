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
  TextField,
} from '@mui/material';
import {
  Receipt,
  AccountCircle,
  TrendingUp,
  TrendingDown,
  Close,
  Print,
  LocationOn,
  DirectionsCar,
  Save,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, updateThunks } from '../../store/liquidacionStore/liquidacionThunks';
import { showAlert } from "../../store/globalStore/globalStore";

// Formatear moneda
const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    id,
    placa,
    tipo_vehiculo,
    tramite_nombre,
    proveedor_nombre,
    proveedor_codigo,
    cliente_nombre,
    departamento_nombre,
    municipio_nombre,
    derechos_tramite,
    servicio_empresa,
    iva_servicio,
    total_facturacion,
    total_facturacion_sin_iva,
    servicio_gestor,
    transporte,
    bonificacion,
    anticipos,
    total_servicio_gestor,
    utilidad,
    es_rentable,
    estado,
    observaciones,
    fecha_finalizado,
  } = useSelector(state => state.liquidacionStore);

  if (!id) return null;

  // Parsear valores numéricos
  const parseNum = (val) => parseFloat(val) || 0;

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

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const handleSave = () => {
    const dataToSend = {
      derechos_tramite: derechos_tramite,
      servicio_empresa: servicio_empresa,
      servicio_gestor: servicio_gestor,
      transporte: transporte,
      bonificacion: bonificacion,
      anticipos: anticipos,
      estado: estado,
      observaciones: observaciones,
    };

    dispatch(updateThunks(id, dataToSend));
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
        Liquidación - Trámite #{id}
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
                  {placa}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Trámite: <strong>{tramite_nombre || 'N/A'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo: <strong>{tipo_vehiculo || 'N/A'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha finalizado: <strong>{formatDate(fecha_finalizado)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountCircle color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary">
                  Gestor:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {proveedor_nombre || 'Sin asignar'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Código: <strong>{proveedor_codigo || 'N/A'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cliente: <strong>{cliente_nombre || 'N/A'}</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {municipio_nombre || 'N/A'}, {departamento_nombre || 'N/A'}
                </Typography>
              </Box>
              <Chip
                label={estado || 'pendiente'}
                color={estado === 'liquidado' || estado === 'pagado' ? 'success' : 'warning'}
                size="small"
                sx={{ mt: 1, textTransform: 'capitalize' }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Grid de dos columnas */}
        <Grid container spacing={3}>
          {/* 1 Card: Facturación */}
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

                {/* Derechos del trámite */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Derechos de Trámite
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(derechos_tramite)}
                  </Typography>
                </Box>

                {/* Servicio empresa */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Servicio Empresa
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(servicio_empresa)}
                  </Typography>
                </Box>

                {/* IVA */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) IVA Servicio Empresa (19%)
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="warning.main">
                    {formatCurrency(iva_servicio)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total Facturación */}
                <Box sx={totalRowStyle}>
                  <Typography variant="h6" fontWeight={700}>
                    Total Facturación
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {formatCurrency(total_facturacion)}
                  </Typography>
                </Box>

                {/* Subtotal sin IVA */}
                <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Subtotal sin IVA: <strong>{formatCurrency(total_facturacion_sin_iva)}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 2 Card: Servicio Gestor */}
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
                    Gestor: <strong>{proveedor_nombre || 'Sin asignar'}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Código: <strong>{proveedor_codigo || 'N/A'}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Municipio: <strong>{municipio_nombre || 'N/A'}</strong>
                  </Typography>
                </Box>

                {/* Conceptos económicos */}
                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Servicio Gestor
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(servicio_gestor)}
                  </Typography>
                </Box>

                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Transporte / Envíos
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(transporte)}
                  </Typography>
                </Box>

                <Box sx={conceptoRowStyle}>
                  <Typography variant="body1" color="text.secondary">
                    (+) Bonificación
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(bonificacion)}
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
                    {formatCurrency(anticipos)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total Servicio Gestor */}
                <Box sx={totalRowStyle}>
                  <Typography variant="h6" fontWeight={700}>
                    Total Servicio Gestor
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {formatCurrency(total_servicio_gestor)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Cálculo de Utilidad */}
        <Box
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: es_rentable ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: es_rentable ? '3px solid rgba(34, 197, 94, 0.4)' : '3px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            {es_rentable ? (
              <TrendingUp color="success" fontSize="large" />
            ) : (
              <TrendingDown color="error" fontSize="large" />
            )}
            <Typography variant="h5" fontWeight={700} color={es_rentable ? 'success.main' : 'error.main'}>
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
                {formatCurrency(servicio_empresa)}
              </Typography>
            </Box>

            <Typography variant="h4" color="text.secondary">-</Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Servicio Gestor
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(total_servicio_gestor)}
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
                color={es_rentable ? 'success.main' : 'error.main'}
              >
                {formatCurrency(utilidad)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Observaciones */}
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observaciones"
            name="observaciones"
            value={observaciones || ''}
            onChange={handleChangeForm}
            placeholder="Notas adicionales sobre esta liquidación..."
          />
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
          variant="outlined"
          color="inherit"
          onClick={onClose}
        >
          Cerrar
        </Button>
        <Button
          startIcon={<Save />}
          variant="contained"
          onClick={handleSave}
          sx={{
            background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
