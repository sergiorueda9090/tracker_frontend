import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from '@mui/material';
import {
  Receipt,
  DirectionsCar,
  PictureAsPdf,
  Assignment,
} from '@mui/icons-material';
import StatusBadge from '../components/StatusBadge';
import '../styles/Pages.css';

const Dashboard = () => {
  // Datos de resumen
  const summaryCards = [
    {
      title: 'Cuentas de Cobro',
      value: '24',
      subtitle: 'Pendientes este mes',
      icon: <Receipt />,
      color: '#00A859',
    },
    {
      title: 'Trámites Asignados',
      value: '156',
      subtitle: 'En curso actualmente',
      icon: <Assignment />,
      color: '#3B82F6',
    },
    {
      title: 'Vehículos Procesados',
      value: '342',
      subtitle: 'Total este mes',
      icon: <DirectionsCar />,
      color: '#F59E0B',
    },
  ];

  // Datos de ejemplo para la tabla de trámites en curso
  const tramitesEnCurso = [
    {
      id: 'TR-001',
      placa: 'ABC-123',
      departamento: 'Cundinamarca',
      tipoVehiculo: 'Automóvil',
      antiguedad: 5,
      estado: 'en_verificacion',
    },
    {
      id: 'TR-002',
      placa: 'XYZ-789',
      departamento: 'Antioquia',
      tipoVehiculo: 'Motocicleta',
      antiguedad: 12,
      estado: 'para_radicacion',
    },
    {
      id: 'TR-003',
      placa: 'DEF-456',
      departamento: 'Valle del Cauca',
      tipoVehiculo: 'Camioneta',
      antiguedad: 8,
      estado: 'en_novedad',
    },
    {
      id: 'TR-004',
      placa: 'GHI-321',
      departamento: 'Atlántico',
      tipoVehiculo: 'Automóvil',
      antiguedad: 3,
      estado: 'enviado',
    },
    {
      id: 'TR-005',
      placa: 'JKL-654',
      departamento: 'Santander',
      tipoVehiculo: 'Camión',
      antiguedad: 15,
      estado: 'en_verificacion',
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1E293B',
            mb: 1,
          }}
        >
          Dashboard de Trámites
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#64748B' }}
        >
          Gestión de trámites de tránsito
        </Typography>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748B',
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#1E293B',
                        mb: 0.5,
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748B' }}
                    >
                      {card.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${card.color}15`,
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(card.icon, {
                      sx: { color: card.color, fontSize: 28 }
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabla de Trámites en Curso */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #E2E8F0' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1E293B',
            }}
          >
            Trámites en Curso
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#64748B', mt: 0.5 }}
          >
            Listado de trámites activos y su estado actual
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Placa</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Tipo de Vehículo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Antigüedad</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tramitesEnCurso.map((tramite) => (
                <TableRow
                  key={tramite.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#F8FAFC',
                    },
                  }}
                >
                  <TableCell sx={{ color: '#1E293B', fontWeight: 500 }}>
                    {tramite.id}
                  </TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 600 }}>
                    {tramite.placa}
                  </TableCell>
                  <TableCell sx={{ color: '#64748B' }}>
                    {tramite.departamento}
                  </TableCell>
                  <TableCell sx={{ color: '#64748B' }}>
                    {tramite.tipoVehiculo}
                  </TableCell>
                  <TableCell sx={{ color: '#64748B' }}>
                    {tramite.antiguedad} días
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tramite.estado} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PictureAsPdf />}
                      sx={{
                        borderColor: '#E2E8F0',
                        color: '#64748B',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: '#00A859',
                          backgroundColor: '#00A85908',
                          color: '#00A859',
                        },
                      }}
                    >
                      Ver PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;