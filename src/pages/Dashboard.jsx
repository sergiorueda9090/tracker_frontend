import React, { useEffect } from 'react';
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
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  HourglassEmpty,
  TrackChanges,
  DoneAll,
  Archive,
  TrendingUp,
  Assignment,
  CheckCircle,
  Warning,
  Info,
  DirectionsCar,
  Business,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import '../styles/Pages.css';

// Importar thunks para cargar datos
import { getAllThunks as getAllPreparacion } from '../store/preparacionStore/preparacionThunks';
import { getAllThunks as getAllTracker } from '../store/trackerStore/trackerThunks';
import { getAllThunks as getAllFinalizados } from '../store/finalizadosStore/finalizadosThunks';
import { getAllThunks as getAllArchivadas } from '../store/archivadasStore/archivadasThunks';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtener datos de los stores
  const { tramites: preparacionTramites } = useSelector(state => state.preparacionStore);
  const { tramites: trackerTramites } = useSelector(state => state.trackerStore);
  const { tramites: finalizadosTramites } = useSelector(state => state.finalizadosStore);
  const { tramites: archivadasTramites } = useSelector(state => state.archivadasStore);

  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(getAllPreparacion());
    dispatch(getAllTracker());
    dispatch(getAllFinalizados());
    dispatch(getAllArchivadas());
  }, [dispatch]);

  // Calcular estadísticas de preparación
  const prepStats = {
    total: preparacionTramites.length,
    enVerificacion: preparacionTramites.filter(t => t.estado === 'en_verificacion').length,
    paraRadicacion: preparacionTramites.filter(t => t.estado === 'para_radicacion').length,
    enNovedad: preparacionTramites.filter(t => t.estado === 'en_novedad').length,
    enviados: preparacionTramites.filter(t => t.estado === 'enviado_tracker').length,
  };

  // Calcular estadísticas de tracker
  const trackerStats = {
    total: trackerTramites.length,
    enRadicacion: trackerTramites.filter(t => t.estado === 'EN_RADICACION').length,
    conNovedad: trackerTramites.filter(t => t.estado === 'CON_NOVEDAD').length,
    finalizado: trackerTramites.filter(t => t.estado === 'FINALIZADO').length,
  };

  // Total de trámites activos
  const totalActivos = prepStats.total + trackerStats.total;
  const totalCompletados = finalizadosTramites.length;
  const totalArchivados = archivadasTramites.length;
  const totalGeneral = totalActivos + totalCompletados + totalArchivados;

  // Tarjetas de resumen principales
  const mainCards = [
    {
      title: 'En Preparación',
      value: prepStats.total,
      subtitle: `${prepStats.enVerificacion} en verificación`,
      icon: <HourglassEmpty />,
      color: '#F59E0B',
      onClick: () => navigate('/preparacion'),
    },
    {
      title: 'En Tracker',
      value: trackerStats.total,
      subtitle: `${trackerStats.enRadicacion} en radicación`,
      icon: <TrackChanges />,
      color: '#3B82F6',
      onClick: () => navigate('/tracker'),
    },
    {
      title: 'Finalizados',
      value: totalCompletados,
      subtitle: 'Trámites completados',
      icon: <DoneAll />,
      color: '#10B981',
      onClick: () => navigate('/finalizados'),
    },
    {
      title: 'Archivados',
      value: totalArchivados,
      subtitle: 'Trámites históricos',
      icon: <Archive />,
      color: '#6B7280',
      onClick: () => navigate('/archivadas'),
    },
  ];

  // Tarjetas de estadísticas secundarias
  const statsCards = [
    {
      title: 'Activos',
      value: totalActivos,
      subtitle: 'Preparación + Tracker',
      icon: <TrendingUp />,
      color: '#00A859',
      percentage: totalGeneral > 0 ? Math.round((totalActivos / totalGeneral) * 100) : 0,
    },
    {
      title: 'Con Novedad',
      value: prepStats.enNovedad + trackerStats.conNovedad,
      subtitle: 'Requieren atención',
      icon: <Warning />,
      color: '#EF4444',
      percentage: totalActivos > 0 ? Math.round(((prepStats.enNovedad + trackerStats.conNovedad) / totalActivos) * 100) : 0,
    },
  ];

  // Combinar todos los trámites y ordenar por fecha (más recientes primero)
  const todosLosTramites = [
    ...preparacionTramites.map(t => ({ ...t, modulo: 'Preparación', moduloColor: '#F59E0B' })),
    ...trackerTramites.map(t => ({ ...t, modulo: 'Tracker', moduloColor: '#3B82F6' })),
    ...finalizadosTramites.slice(0, 5).map(t => ({ ...t, modulo: 'Finalizados', moduloColor: '#10B981' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

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
          Dashboard de Gestión
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#64748B' }}
        >
          Vista general de trámites de tránsito en tiempo real
        </Typography>
      </Box>

      {/* Tarjetas principales de módulos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mainCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={card.onClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
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

      {/* Tarjetas de estadísticas con progreso */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#1E293B',
                        }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: card.color, fontWeight: 600 }}
                      >
                        {card.percentage}%
                      </Typography>
                    </Box>
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
                <LinearProgress
                  variant="determinate"
                  value={card.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: card.color,
                      borderRadius: 4,
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabla de Últimos Trámites */}
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
            Actividad Reciente
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#64748B', mt: 0.5 }}
          >
            Últimos 10 trámites registrados en el sistema
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Módulo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Placa</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Tipo Vehículo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Ubicación</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Proveedor</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todosLosTramites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Assignment sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No hay trámites registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Los trámites aparecerán aquí cuando sean creados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                todosLosTramites.map((tramite, index) => (
                  <TableRow
                    key={`${tramite.modulo}-${tramite.id}-${index}`}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F8FAFC',
                      },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={tramite.modulo}
                        size="small"
                        sx={{
                          backgroundColor: `${tramite.moduloColor}15`,
                          color: tramite.moduloColor,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 500 }}>
                      #{tramite.id}
                    </TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 600 }}>
                      {tramite.placa}
                    </TableCell>
                    <TableCell sx={{ color: '#64748B' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar sx={{ fontSize: 18, color: '#94A3B8' }} />
                        {tramite.tipo_vehiculo}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748B' }}>
                      {tramite.nombre_depto ? `${tramite.nombre_depto} - ${tramite.nombre_muni}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tramite.estado} />
                    </TableCell>
                    <TableCell sx={{ color: '#64748B' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tramite.proveedor_nombre ? (
                          <>
                            <Business sx={{ fontSize: 18, color: '#94A3B8' }} />
                            {tramite.proveedor_nombre}
                          </>
                        ) : (
                          'Sin asignar'
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                      {tramite.created_at
                        ? new Date(tramite.created_at).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
