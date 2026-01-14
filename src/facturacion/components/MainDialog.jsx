import React, { useState } from 'react';
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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper,
} from '@mui/material';
import {
  Receipt,
  Person,
  DirectionsCar,
  Send,
  Close,
  Print,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

// Importar funciones
import { formatCurrency, formatDate, formatDateTime } from '../data/mockData';
import {
  validarFacturaSiigo,
  enviarFacturaSiigo,
  obtenerResumenFactura,
} from '../utils/siigoTransformer';

const MainDialog = ({ open, onClose, facturaData }) => {
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(facturaData?.estado === 'enviada');
  const [numeroSiigo, setNumeroSiigo] = useState(facturaData?.numero_factura);

  if (!facturaData) return null;

  const { cliente, tramite, valores } = facturaData;

  // Validar factura para Siigo
  const validacion = validarFacturaSiigo(facturaData);

  // Handler para enviar a Siigo
  const handleEnviarSiigo = async () => {
    if (!validacion.valid) {
      alert(`No se puede enviar la factura:\n${validacion.errors.join('\n')}`);
      return;
    }

    setEnviando(true);
    try {
      const resultado = await enviarFacturaSiigo(facturaData);
      if (resultado.success) {
        setEnviada(true);
        setNumeroSiigo(resultado.numero_factura);
        alert(`Factura enviada exitosamente a Siigo\nNúmero de factura: ${resultado.numero_factura}`);
      }
    } catch (error) {
      alert(`Error al enviar factura: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          color: '#00A859',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid rgba(0, 168, 89, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt />
          Previsualización de Factura
        </Box>
        <Chip
          label={enviada ? 'Enviada a Siigo' : 'Pendiente'}
          color={enviada ? 'success' : 'warning'}
          icon={enviada ? <CheckCircle /> : <Warning />}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#F8FAFC' }}>
        {/* Alerta de validación */}
        {!validacion.valid && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Errores de validación:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validacion.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Encabezado de factura */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
                Datos de la Factura
              </Typography>
              <Typography variant="body2">
                <strong>ID Interno:</strong> {facturaData.factura_id}
              </Typography>
              {numeroSiigo && (
                <Typography variant="body2" color="success.main">
                  <strong>Número Siigo:</strong> {numeroSiigo}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Fecha Creación:</strong> {formatDate(facturaData.fecha_creacion)}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha Vencimiento:</strong> {formatDate(facturaData.fecha_vencimiento)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight={700} color="primary">
                {formatCurrency(valores.total)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total con IVA
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Información del Cliente */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Información del Cliente
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {cliente.razon_social ? 'Razón Social' : 'Nombre Completo'}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {cliente.razon_social || cliente.nombre}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Documento
                    </Typography>
                    <Typography variant="body2">
                      {cliente.tipo_documento}: {cliente.numero_documento}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{cliente.email}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body2">{cliente.telefono}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Dirección
                    </Typography>
                    <Typography variant="body2">{cliente.direccion}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cliente.municipio}, {cliente.departamento}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información del Trámite */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DirectionsCar color="primary" />
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Información del Trámite
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tipo de Trámite
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {tramite.tipo_tramite}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Placa del Vehículo
                    </Typography>
                    <Chip
                      label={tramite.placa}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Número de Trámite
                    </Typography>
                    <Typography variant="body2">{tramite.numero_tramite}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha Finalizado
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(tramite.fecha_finalizado)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Gestor
                    </Typography>
                    <Typography variant="body2">
                      {tramite.proveedor_nombre} ({tramite.proveedor_codigo})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tramite.municipio_tramite}, {tramite.departamento_tramite}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detalle de la Factura */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
            Detalle de la Factura
          </Typography>

          <TableContainer component={MuiPaper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 168, 89, 0.1)' }}>
                  <TableCell><strong>Descripción</strong></TableCell>
                  <TableCell align="center"><strong>Cantidad</strong></TableCell>
                  <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
                  <TableCell align="right"><strong>Subtotal</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Item 1: Trámite */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {valores.tramite_descripcion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Código: TRA-{tramite.tipo_tramite.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="right">
                    {formatCurrency(valores.tramite_precio)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(valores.tramite_precio)}
                  </TableCell>
                </TableRow>

                {/* Item 2: Servicio Empresa */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {valores.servicio_empresa_descripcion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Código: SRV-GESTION
                    </Typography>
                  </TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="right">
                    {formatCurrency(valores.servicio_empresa)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(valores.servicio_empresa)}
                  </TableCell>
                </TableRow>

                {/* Subtotal */}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="body1" fontWeight={600}>
                      Subtotal:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={600}>
                      {formatCurrency(valores.subtotal)}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* IVA */}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="body1" fontWeight={600} color="warning.main">
                      IVA ({valores.iva_porcentaje}%):
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={600} color="warning.main">
                      {formatCurrency(valores.iva_monto)}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Total */}
                <TableRow sx={{ backgroundColor: 'rgba(0, 168, 89, 0.1)' }}>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6" fontWeight={700} color="primary">
                      TOTAL:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {formatCurrency(valores.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Notas adicionales */}
        {facturaData.notas && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0, 168, 89, 0.05)', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Notas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {facturaData.notas}
            </Typography>
          </Box>
        )}

        {/* Información de integración Siigo */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1, border: '1px solid rgba(33, 150, 243, 0.3)' }}>
          <Typography variant="subtitle2" fontWeight={600} color="info.main" gutterBottom>
            Integración con Siigo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta factura está preparada para ser enviada automáticamente a Siigo.
            Los datos se transformarán al formato requerido por la API de Siigo antes del envío.
          </Typography>
          {enviada && numeroSiigo && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              Esta factura ya fue enviada a Siigo con el número: <strong>{numeroSiigo}</strong>
            </Typography>
          )}
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
        {!enviada && (
          <Button
            startIcon={<Send />}
            variant="contained"
            color="success"
            onClick={handleEnviarSiigo}
            disabled={!validacion.valid || enviando}
            sx={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              },
            }}
          >
            {enviando ? 'Enviando...' : 'Enviar a Siigo'}
          </Button>
        )}
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
