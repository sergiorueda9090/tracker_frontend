import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Paper, Typography, Button, Divider,
    Chip, Avatar, Grid, LinearProgress, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    List, ListItem, ListItemIcon, ListItemText, CircularProgress, Alert
} from '@mui/material';
import {
    Timeline, TimelineItem, TimelineSeparator,
    TimelineConnector, TimelineContent, TimelineDot, timelineItemClasses
} from '@mui/lab';
import {
    ArrowBack, History as HistoryIcon,
    Description, DeleteForever, CloudUpload, EditNote,
    CheckCircle, Rule, MyLocation, DirectionsCar,
    InfoOutlined, VerifiedUser, Security, AddCircle
} from '@mui/icons-material';

import axios from 'axios';
import { URL } from '../constants/constantGlogal';
import '../styles/history.css';

const History = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { token } = useSelector(state => state.authStore);

    // Estados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tramiteData, setTramiteData] = useState(null);
    const [historial, setHistorial] = useState([]);

    // Cargar datos del trámite y su historial
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener información del trámite
                const tramiteResponse = await axios.get(
                    `${URL}/api/tracker/${id}/`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // Obtener historial del trámite
                const historyResponse = await axios.get(
                    `${URL}/api/tracker/${id}/history/`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setTramiteData(tramiteResponse.data);
                setHistorial(historyResponse.data.trazabilidad_completa || []);

            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar la información del trámite. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            fetchData();
        }
    }, [id, token]);

    // Función para obtener estilos según el tipo de evento
    const getEventStyles = (evento, entidad) => {
        // Mapeo de eventos del backend
        const eventType = evento.toLowerCase();

        if (eventType.includes('created') || eventType.includes('creado') || entidad === 'Archivo') {
            return { icon: <AddCircle />, color: '#059669', bg: '#dcfce7' };
        }
        if (eventType.includes('changed') || eventType.includes('modificado') || eventType.includes('actualiz')) {
            return { icon: <EditNote />, color: '#4338ca', bg: '#e0e7ff' };
        }
        if (eventType.includes('deleted') || eventType.includes('eliminado')) {
            return { icon: <DeleteForever />, color: '#dc2626', bg: '#fee2e2' };
        }
        if (eventType.includes('estado')) {
            return { icon: <CheckCircle />, color: '#d97706', bg: '#fef3c7' };
        }

        return { icon: <InfoOutlined />, color: '#64748b', bg: '#f1f5f9' };
    };

    // Calcular progreso basado en estado
    const getProgreso = (estado) => {
        const progresoMap = {
            'EN_RADICACION': 50,
            'CON_NOVEDAD': 35,
            'FINALIZADO': 100
        };
        return progresoMap[estado] || 0;
    };

    // Obtener label de estado
    const getEstadoLabel = (estado) => {
        const estadoMap = {
            'EN_RADICACION': 'En Radicación',
            'CON_NOVEDAD': 'Con Novedad',
            'FINALIZADO': 'Finalizado'
        };
        return estadoMap[estado] || estado;
    };

    // Formatear fecha
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return {
            fecha: date.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            hora: date.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    // Renderizar contenido del evento según tipo
    const renderEventContent = (event) => {
        const { detalles, descripcion, tipo } = event;

        // Si hay detalles de cambios, mostrar tabla
        if (detalles && detalles.length > 0) {
            return (
                <TableContainer component={Box} sx={{ border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>Campo</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Anterior</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Nuevo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detalles.map((cambio, idx) => (
                                <TableRow key={idx}>
                                    <TableCell sx={{ fontWeight: 600 }}>{cambio.campo}</TableCell>
                                    <TableCell sx={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                                        {cambio.anterior !== null && cambio.anterior !== undefined ? String(cambio.anterior) : '-'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#10b981', fontWeight: 800 }}>
                                        {cambio.nuevo !== null && cambio.nuevo !== undefined ? String(cambio.nuevo) : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        // Si es un evento de archivo
        if (tipo === 'archivo') {
            return (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, bgcolor: '#faf5ff', borderRadius: '10px' }}>
                    <Description sx={{ fontSize: 40, color: '#7e22ce' }} />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{descripcion}</Typography>
                        <Typography variant="caption" color="text.secondary">Archivo asociado al trámite</Typography>
                    </Box>
                </Stack>
            );
        }

        // Descripción simple
        return (
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#475569', p: 2, bgcolor: '#f8fafc', borderRadius: '10px' }}>
                {descripcion}
            </Typography>
        );
    };

    // Renderizado de loading
    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                bgcolor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} sx={{ color: '#00A859' }} />
                <Typography variant="h6" color="text.secondary">Cargando historial del trámite...</Typography>
            </Box>
        );
    }

    // Renderizado de error
    if (error) {
        return (
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                bgcolor: '#f8fafc',
                p: { xs: 2, md: 5 }
            }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/tracker')}
                    sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' } }}
                >
                    Volver al Panel
                </Button>
            </Box>
        );
    }

    // Si no hay datos del trámite
    if (!tramiteData) {
        return (
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                bgcolor: '#f8fafc',
                p: { xs: 2, md: 5 }
            }}>
                <Alert severity="warning">
                    No se encontró información del trámite.
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/tracker')}
                    sx={{ mt: 2, bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' } }}
                >
                    Volver al Panel
                </Button>
            </Box>
        );
    }

    const progreso = getProgreso(tramiteData.estado);

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            bgcolor: '#f8fafc',
            p: { xs: 2, md: 5 },
            boxSizing: 'border-box'
        }}>

            {/* HEADER */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ mb: 5 }}
            >
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                        Auditoría Maestra
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Trámite: <strong>#{tramiteData.id}</strong> • Placa: <strong>{tramiteData.placa}</strong> • Historial de transacciones completo
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/tracker')}
                    sx={{ bgcolor: '#1e293b', borderRadius: '10px', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#0f172a' } }}
                >
                    Volver al Panel
                </Button>
            </Stack>

            <Grid container spacing={4}>
                {/* LATERAL (INFO VEHÍCULO) */}
                <Grid item xs={12} lg={3}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Resumen del Trámite</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                <ListItem disableGutters>
                                    <ListItemIcon><DirectionsCar sx={{ color: '#4f46e5' }}/></ListItemIcon>
                                    <ListItemText
                                        primary="Vehículo"
                                        secondary={`${tramiteData.placa} (${tramiteData.tipo_vehiculo})`}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><MyLocation sx={{ color: '#4f46e5' }}/></ListItemIcon>
                                    <ListItemText
                                        primary="Jurisdicción"
                                        secondary="Información del municipio"
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><VerifiedUser sx={{ color: '#059669' }}/></ListItemIcon>
                                    <ListItemText
                                        primary="Estado"
                                        secondary={
                                            <Chip
                                                label={getEstadoLabel(tramiteData.estado)}
                                                size="small"
                                                sx={{ bgcolor: '#dcfce7', color: '#059669', fontWeight: 800, mt: 0.5 }}
                                            />
                                        }
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><InfoOutlined sx={{ color: '#4f46e5' }}/></ListItemIcon>
                                    <ListItemText
                                        primary="Usuario"
                                        secondary={tramiteData.usuario || 'Sin asignar'}
                                    />
                                </ListItem>
                            </List>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>PROGRESO DEL EXPEDIENTE</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progreso}
                                    sx={{ height: 10, borderRadius: 5, mt: 1, bgcolor: '#e2e8f0' }}
                                />
                                <Typography variant="h5" sx={{ textAlign: 'right', mt: 1, fontWeight: 900, color: '#4f46e5' }}>
                                    {progreso}%
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Estadísticas del Historial */}
                        <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Estadísticas</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Total de Eventos
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#4f46e5', mb: 2 }}>
                                    {historial.length}
                                </Typography>

                                <Typography variant="caption" color="text.secondary" display="block">
                                    Fecha de Creación
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {new Date(tramiteData.created_at).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>

                {/* LINEA DE TIEMPO */}
                <Grid item xs={12} lg={9}>
                    <Paper sx={{ p: { xs: 2, md: 5 }, borderRadius: '20px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
                            <HistoryIcon sx={{ color: '#1e293b', fontSize: 30 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>Trazabilidad Operativa</Typography>
                        </Stack>

                        {historial.length === 0 ? (
                            <Box textAlign="center" py={8}>
                                <HistoryIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No hay historial disponible
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Este trámite aún no tiene registros de cambios.
                                </Typography>
                            </Box>
                        ) : (
                            <Timeline sx={{ [`& .${timelineItemClasses.root}:before`]: { display: 'none' }, p: 0 }}>
                                {historial.map((item, index) => {
                                    const styles = getEventStyles(item.evento, item.entidad);
                                    const { fecha, hora } = formatFecha(item.fecha);

                                    return (
                                        <TimelineItem key={index}>
                                            <TimelineSeparator>
                                                <TimelineDot sx={{ bgcolor: styles.bg, p: 2, boxShadow: 'none' }}>
                                                    {React.cloneElement(styles.icon, { sx: { color: styles.color } })}
                                                </TimelineDot>
                                                {index < historial.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>

                                            <TimelineContent sx={{ mb: 6, pr: 0 }}>
                                                <Box sx={{
                                                    p: 3,
                                                    borderRadius: '15px',
                                                    border: '1px solid #e2e8f0',
                                                    bgcolor: '#fff',
                                                    borderLeft: `6px solid ${styles.color}`,
                                                    transition: '0.3s',
                                                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                                }}>
                                                    {/* Meta Info: Usuario y Hora */}
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <Avatar sx={{ width: 35, height: 35, bgcolor: '#475569', fontSize: '0.9rem' }}>
                                                                {item.usuario ? item.usuario.charAt(0).toUpperCase() : 'S'}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                                    {item.usuario || 'Sistema'}
                                                                </Typography>
                                                                <Typography variant="caption" color="textSecondary">
                                                                    {item.entidad}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                                {fecha}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 800 }}>
                                                                {hora}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#334155' }}>
                                                        {item.evento} - {item.descripcion}
                                                    </Typography>

                                                    {/* Contenido dinámico del evento */}
                                                    {renderEventContent(item)}
                                                </Box>
                                            </TimelineContent>
                                        </TimelineItem>
                                    );
                                })}
                            </Timeline>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default History;
