import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, Button, Divider, 
    Chip, Avatar, Grid, LinearProgress, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
    Timeline, TimelineItem, TimelineSeparator, 
    TimelineConnector, TimelineContent, TimelineDot, timelineItemClasses 
} from '@mui/lab';
import { 
    ArrowBack, History as HistoryIcon, 
    Description, DeleteForever, CloudUpload, EditNote,
    CheckCircle, Rule, MyLocation, DirectionsCar,
    InfoOutlined, VerifiedUser, Security
} from '@mui/icons-material';

import '../styles/history.css';

const Main = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tramite] = useState({
        placa: "ABC-123",
        tipo: "Motocicleta",
        municipio: "Bucaramanga",
        departamento: "Santander",
        estadoActual: "Para Radicación",
        progreso: 85,
        expediente: "PRP-2025-001"
    });

    // --- DATOS DE PRUEBA EXTENDIDOS CON USUARIO Y HORA ---
    const [historial] = useState([
        {
            id: 1,
            tipo: 'CAMBIO_ESTADO',
            titulo: 'Actualización de Fase Operativa',
            fecha: '2025-01-20',
            hora: '09:30 AM',
            usuario: 'carlos.rojas',
            rol: 'Auditor Senior',
            detalles: { campo: 'Estado del Proceso', anterior: 'En Verificación', nuevo: 'Para Radicación' }
        },
        {
            id: 2,
            tipo: 'ARCHIVO_CARGADO',
            titulo: 'Nuevo Soporte Técnico Cargado',
            fecha: '2025-01-20',
            hora: '08:15 AM',
            usuario: 'marta.lopez',
            rol: 'Técnico de Campo',
            archivo: { nombre: 'improntas_serial.pdf', peso: '1.8 MB', hash: 'SHA256: a7b2...92c1' }
        },
        {
            id: 3,
            tipo: 'CHECKLIST',
            titulo: 'Validación Automática RUNT',
            fecha: '2025-01-19',
            hora: '04:45 PM',
            usuario: 'sistema.api',
            rol: 'Servicio Automático',
            json: { impuestos_pago: true, soat_vigente: true, multas_pendientes: 0 }
        },
        {
            id: 4,
            tipo: 'ELIMINACION',
            titulo: 'Documento Descartado',
            fecha: '2025-01-19',
            hora: '11:20 AM',
            usuario: 'admin_central',
            rol: 'Super Administrador',
            motivo: 'Imagen ilegible, se solicita captura en alta resolución.',
            archivo_eliminado: 'cedula_anterior_v1.jpg'
        },
        {
            id: 5,
            tipo: 'SECURITY',
            titulo: 'Apertura de Expediente Digital',
            fecha: '2025-01-18',
            hora: '02:00 PM',
            usuario: 'jorge.ramirez',
            rol: 'Radicador',
            detalles: 'Creación inicial del trámite en plataforma'
        }
    ]);

    const getEventStyles = (tipo) => {
        switch(tipo) {
            case 'CAMBIO_ESTADO': return { icon: <EditNote />, color: '#4338ca', bg: '#e0e7ff' };
            case 'ARCHIVO_CARGADO': return { icon: <CloudUpload />, color: '#7e22ce', bg: '#f3e8ff' };
            case 'CHECKLIST': return { icon: <CheckCircle />, color: '#d97706', bg: '#fef3c7' };
            case 'ELIMINACION': return { icon: <DeleteForever />, color: '#dc2626', bg: '#fee2e2' };
            case 'SECURITY': return { icon: <Security />, color: '#059669', bg: '#dcfce7' };
            default: return { icon: <InfoOutlined />, color: '#64748b', bg: '#f1f5f9' };
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', // Ocupa toda la altura de la pantalla
            width: '100%',      // Ocupa todo el ancho
            bgcolor: '#f8fafc', 
            p: { xs: 2, md: 5 },
            boxSizing: 'border-box' 
        }}>
            
            {/* --- HEADER --- */}
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
                        Expediente: <strong>{tramite.expediente}</strong> • Historial de transacciones y archivos.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/preparacion')}
                    sx={{ bgcolor: '#1e293b', borderRadius: '10px', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#0f172a' } }}
                >
                    Volver al Panel
                </Button>
            </Stack>

            <Grid container spacing={4}>
                {/* --- LATERAL (INFO VEHÍCULO) --- */}
                <Grid item xs={12} lg={3}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Resumen del Trámite</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                <ListItem disableGutters>
                                    <ListItemIcon><DirectionsCar sx={{ color: '#4f46e5' }}/></ListItemIcon>
                                    <ListItemText primary="Vehículo" secondary={`${tramite.placa} (${tramite.tipo})`} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><MyLocation sx={{ color: '#4f46e5' }}/></ListItemIcon>
                                    <ListItemText primary="Jurisdicción" secondary={`${tramite.municipio}, ${tramite.departamento}`} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><VerifiedUser sx={{ color: '#059669' }}/></ListItemIcon>
                                    <ListItemText primary="Estado" secondary={<Chip label={tramite.estadoActual} size="small" sx={{ bgcolor: '#dcfce7', color: '#059669', fontWeight: 800, mt: 0.5 }} />} />
                                </ListItem>
                            </List>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>PROGRESO DEL EXPEDIENTE</Typography>
                                <LinearProgress variant="determinate" value={tramite.progreso} sx={{ height: 10, borderRadius: 5, mt: 1, bgcolor: '#e2e8f0' }} />
                                <Typography variant="h5" sx={{ textAlign: 'right', mt: 1, fontWeight: 900, color: '#4f46e5' }}>{tramite.progreso}%</Typography>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>

                {/* --- LINEA DE TIEMPO (OCUPA EL RESTO) --- */}
                <Grid item xs={12} lg={9}>
                    <Paper sx={{ p: { xs: 2, md: 5 }, borderRadius: '20px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
                            <HistoryIcon sx={{ color: '#1e293b', fontSize: 30 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>Trazabilidad Operativa</Typography>
                        </Stack>

                        <Timeline sx={{ [`& .${timelineItemClasses.root}:before`]: { display: 'none' }, p: 0 }}>
                            {historial.map((item) => {
                                const styles = getEventStyles(item.tipo);
                                return (
                                    <TimelineItem key={item.id}>
                                        <TimelineSeparator>
                                            <TimelineDot sx={{ bgcolor: styles.bg, p: 2, boxShadow: 'none' }}>
                                                {React.cloneElement(styles.icon, { sx: { color: styles.color } })}
                                            </TimelineDot>
                                            <TimelineConnector />
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
                                                            {item.usuario.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>@{item.usuario}</Typography>
                                                            <Typography variant="caption" color="textSecondary">{item.rol}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{item.fecha}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 800 }}>{item.hora}</Typography>
                                                    </Box>
                                                </Stack>

                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#334155' }}>{item.titulo}</Typography>

                                                {/* Contenido dinámico según el tipo */}
                                                {item.tipo === 'CAMBIO_ESTADO' && (
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
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: 600 }}>{item.detalles.campo}</TableCell>
                                                                    <TableCell sx={{ color: '#94a3b8', textDecoration: 'line-through' }}>{item.detalles.anterior}</TableCell>
                                                                    <TableCell sx={{ color: '#10b981', fontWeight: 800 }}>{item.detalles.nuevo}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                )}

                                                {item.tipo === 'ARCHIVO_CARGADO' && (
                                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, bgcolor: '#faf5ff', borderRadius: '10px' }}>
                                                        <Description sx={{ fontSize: 40, color: '#7e22ce' }} />
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{item.archivo.nombre}</Typography>
                                                            <Typography variant="caption" sx={{ display: 'block' }}>{item.archivo.peso} • {item.archivo.hash}</Typography>
                                                        </Box>
                                                    </Stack>
                                                )}

                                                {item.tipo === 'CHECKLIST' && (
                                                    <Box sx={{ bgcolor: '#0f172a', p: 2, borderRadius: '10px', overflowX: 'auto' }}>
                                                        <pre style={{ margin: 0, color: '#38bdf8', fontSize: '0.85rem' }}>
                                                            {JSON.stringify(item.json, null, 2)}
                                                        </pre>
                                                    </Box>
                                                )}

                                                {item.tipo === 'ELIMINACION' && (
                                                    <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: '10px', border: '1px solid #fee2e2' }}>
                                                        <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>Motivo: {item.motivo}</Typography>
                                                        <Typography variant="caption">Archivo: {item.archivo_eliminado}</Typography>
                                                    </Box>
                                                )}

                                                {item.tipo === 'SECURITY' && (
                                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#475569' }}>
                                                        {item.detalles}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TimelineContent>
                                    </TimelineItem>
                                );
                            })}
                        </Timeline>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Main;