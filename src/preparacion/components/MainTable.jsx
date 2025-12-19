import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  Badge,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
} from '@mui/material';
import {
  Edit,
  Delete,
  Folder,
  CheckCircle,
  HourglassEmpty,
  Warning,
  Send,
  PictureAsPdf,
  Image as ImageIcon,
  FolderOpen,
  Close,
  Download,
  Visibility,
  InsertDriveFile,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { showAlert } from "../../store/globalStore/globalStore";

import { getAllThunks, showThunk, deleteThunk, deleteArchivoThunk } from '../../store/preparacionStore/preparacionThunks';
import Pagination from './Pagination';

const MainTable = () => {

  const dispatch = useDispatch();

  useEffect(() => { dispatch(getAllThunks()); }, [dispatch]);

  const { tramites } = useSelector(state => state.preparacionStore);

  // Estados para el diálogo de archivos
  const [openFilesDialog, setOpenFilesDialog] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAction = (id) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (tramite) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar el trámite con placa "${tramite.placa}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar trámite",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(tramite.id));
      }
    }));
  };

  // Handlers para el diálogo de archivos
  const handleOpenFiles = (tramite) => {
    setSelectedTramite(tramite);
    setSelectedFile(tramite.archivos && tramite.archivos.length > 0 ? tramite.archivos[0] : null);
    setOpenFilesDialog(true);
  };

  const handleCloseFiles = () => {
    setOpenFilesDialog(false);
    setSelectedTramite(null);
    setSelectedFile(null);
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };

  const handleDownloadFile = (file) => {
    // Construir URL completa del archivo
    const fileUrl = `http://127.0.0.1:8000/media/${file.url}`;
    window.open(fileUrl, '_blank');
  };

  const handleDeleteFile = async (archivo) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmar Eliminación",
      text: `¿Está seguro que desea eliminar el archivo "${archivo.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      action: async () => {
        const result = await dispatch(deleteArchivoThunk(archivo.id));
        if (result.success) {
          // Actualizar la lista de archivos del trámite seleccionado
          const updatedArchivos = selectedTramite.archivos.filter(a => a.id !== archivo.id);
          setSelectedTramite({
            ...selectedTramite,
            archivos: updatedArchivos,
            total_archivos: updatedArchivos.length
          });

          // Si el archivo eliminado era el seleccionado, seleccionar otro
          if (selectedFile?.id === archivo.id) {
            setSelectedFile(updatedArchivos.length > 0 ? updatedArchivos[0] : null);
          }

          // Actualizar la lista de trámites
          dispatch(getAllThunks());
        }
      }
    }));
  };

  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Calcular tamaño total de archivos
  const getTotalFileSize = (archivos) => {
    if (!archivos || archivos.length === 0) return 0;
    return archivos.reduce((total, archivo) => total + archivo.tamaño, 0);
  };

  // Función para obtener el chip de estado
  const getEstadoChip = (estado) => {
    const estados = {
      'en_verificacion': {
        label: 'En Verificación',
        color: 'info',
        icon: <HourglassEmpty fontSize="small" />
      },
      'para_radicacion': {
        label: 'Para Radicación',
        color: 'warning',
        icon: <CheckCircle fontSize="small" />
      },
      'en_novedad': {
        label: 'En Novedad',
        color: 'error',
        icon: <Warning fontSize="small" />
      },
      'enviado_tracker': {
        label: 'Enviado a Tracker',
        color: 'success',
        icon: <Send fontSize="small" />
      }
    };

    const estadoConfig = estados[estado] || estados['en_verificacion'];

    return (
      <Chip
        label={estadoConfig.label}
        size="small"
        color={estadoConfig.color}
        icon={estadoConfig.icon}
      />
    );
  };

  return (
    <Paper className="page-paper">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Placa</strong></TableCell>
              <TableCell><strong>Tipo de Vehículo</strong></TableCell>
              <TableCell><strong>Ubicación</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Documentos</strong></TableCell>
              <TableCell align="center"><strong>Archivos</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell align="center"><strong>Fecha Creación</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tramites.map((tramite) => (
              <TableRow key={tramite.id} className="table-row">

                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    #{tramite.id}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    {tramite.placa}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {tramite.tipo_vehiculo}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {tramite.nombre_depto} - {tramite.nombre_muni}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {getEstadoChip(tramite.estado)}
                </TableCell>

                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <CheckCircle
                      fontSize="small"
                      color={tramite.documentos_completos ? "success" : "disabled"}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {tramite.documentos_completados || 0}/{tramite.total_documentos || 0}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Tooltip
                    title={tramite.total_archivos > 0 ? "Ver archivos" : "No hay archivos"}
                    placement="left"
                    arrow
                  >
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <IconButton
                        onClick={() => tramite.total_archivos > 0 && handleOpenFiles(tramite)}
                        disabled={tramite.total_archivos === 0}
                        sx={{
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: tramite.total_archivos > 0 ? 'scale(1.1)' : 'none'
                          }
                        }}
                      >
                        <Badge
                          badgeContent={tramite.total_archivos || 0}
                          color={tramite.total_archivos > 0 ? "primary" : "default"}
                          max={99}
                        >
                          {tramite.total_archivos > 0 ? (
                            <FolderOpen sx={{ color: '#00A859', fontSize: 28 }} />
                          ) : (
                            <Folder sx={{ color: '#9e9e9e', fontSize: 28 }} />
                          )}
                        </Badge>
                      </IconButton>
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {tramite.usuario}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {new Date(tramite.created_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => handleAction(tramite.id)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDelete(tramite)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Componente de Paginación */}
      <Pagination />

      {/* Diálogo de Visualización de Archivos Mejorado */}
      <Dialog
        open={openFilesDialog}
        onClose={handleCloseFiles}
        maxWidth="xl"
        fullWidth
        fullScreen={(window.innerWidth < 900)}
        PaperProps={{
          sx: {
            minHeight: { xs: '100vh', md: '85vh' },
            maxHeight: { xs: '100vh', md: '90vh' },
            m: { xs: 0, md: 2 }
          }
        }}
      >
        {/* Header con información del trámite */}
        <DialogTitle sx={{
          bgcolor: '#00A859',
          color: 'white',
          p: { xs: 2, md: 3 }
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <FolderOpen sx={{ fontSize: { xs: 28, md: 36 } }} />
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  Archivos del Trámite
                </Typography>
                {selectedTramite && (
                  <Typography variant="body2" sx={{ opacity: 0.95, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Placa: <strong>{selectedTramite.placa}</strong> • {selectedTramite.tipo_vehiculo}
                  </Typography>
                )}
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseFiles}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Estadísticas de archivos */}
          {selectedTramite && selectedTramite.archivos && (
            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
              <Chip
                icon={<InsertDriveFile />}
                label={`${selectedTramite.total_archivos} archivo(s)`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
              <Chip
                icon={<Folder />}
                label={`Tamaño total: ${formatFileSize(getTotalFileSize(selectedTramite.archivos))}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          )}
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, display: 'flex', height: '100%', bgcolor: '#fafafa' }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Panel Izquierdo - Lista de Archivos */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                borderRight: { md: '1px solid' },
                borderBottom: { xs: '1px solid', md: 'none' },
                borderColor: 'divider',
                bgcolor: '#f8f9fa',
                overflowY: 'auto',
                maxHeight: { xs: '40vh', md: '100%' }
              }}
            >
              <Box p={{ xs: 1.5, md: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={700} letterSpacing={0.5}>
                    ARCHIVOS ({selectedTramite?.archivos?.length || 0})
                  </Typography>
                </Box>

                {selectedTramite?.archivos && selectedTramite.archivos.length > 0 ? (
                  <List disablePadding>
                    {selectedTramite.archivos.map((archivo) => (
                      <Card
                        key={archivo.id}
                        sx={{
                          mb: 1.5,
                          border: selectedFile?.id === archivo.id ? '2px solid #00A859' : '1px solid #e0e0e0',
                          bgcolor: selectedFile?.id === archivo.id ? 'rgba(0, 168, 89, 0.08)' : 'white',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-3px)',
                            borderColor: '#00A859'
                          },
                          position: 'relative'
                        }}
                      >
                        <CardActionArea onClick={() => handleSelectFile(archivo)}>
                          <CardContent sx={{ p: 1.5 }}>
                            <Box display="flex" alignItems="flex-start" gap={1.5}>
                              {archivo.tipo === 'application/pdf' ? (
                                <PictureAsPdf sx={{ fontSize: 40, color: '#d32f2f', flexShrink: 0 }} />
                              ) : (
                                <ImageIcon sx={{ fontSize: 40, color: '#1976d2', flexShrink: 0 }} />
                              )}
                              <Box flex={1} minWidth={0}>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{
                                    mb: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                  title={archivo.nombre}
                                >
                                  {archivo.nombre}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap" mb={0.5}>
                                  <Chip
                                    label={archivo.tipo === 'application/pdf' ? 'PDF' : 'IMG'}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.65rem',
                                      bgcolor: archivo.tipo === 'application/pdf' ? '#ffebee' : '#e3f2fd',
                                      color: archivo.tipo === 'application/pdf' ? '#d32f2f' : '#1976d2',
                                      fontWeight: 600
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {formatFileSize(archivo.tamaño)}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {new Date(archivo.created_at).toLocaleDateString('es-CO', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </CardActionArea>

                        {/* Botón de eliminar */}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(archivo);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: 1,
                            '&:hover': {
                              bgcolor: '#ffebee',
                              color: 'error.main'
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Card>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={6}>
                    <InsertDriveFile sx={{ fontSize: 64, color: '#bdbdbd', mb: 2, opacity: 0.5 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      No hay archivos disponibles
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Panel Derecho - Vista Previa */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#ffffff',
                position: 'relative',
                minHeight: { xs: '60vh', md: 'auto' }
              }}
            >
              {selectedFile ? (
                <>
                  {/* Barra de Acciones Mejorada */}
                  <Box sx={{
                    p: { xs: 1.5, md: 2 },
                    bgcolor: 'white',
                    borderBottom: '2px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5
                  }}>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {selectedFile.nombre}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={0.5}>
                        <Chip
                          size="small"
                          label={selectedFile.tipo === 'application/pdf' ? 'PDF' : 'Imagen'}
                          sx={{ height: 22, fontSize: '0.7rem' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(selectedFile.tamaño)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {new Date(selectedFile.created_at).toLocaleDateString('es-CO')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteFile(selectedFile)}
                        color="error"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleDownloadFile(selectedFile)}
                        sx={{
                          bgcolor: '#00A859',
                          '&:hover': { bgcolor: '#008e4a' },
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Descargar
                      </Button>
                    </Box>
                  </Box>

                  {/* Área de Vista Previa Mejorada */}
                  <Box sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 1, md: 2 },
                    overflow: 'auto',
                    bgcolor: '#f8f9fa'
                  }}>
                    {selectedFile.tipo === 'application/pdf' ? (
                      <iframe
                        src={`http://127.0.0.1:8000/media/${selectedFile.url}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          minHeight: '500px',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        title={selectedFile.nombre}
                      />
                    ) : (
                      <Box sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2
                      }}>
                        <img
                          src={`http://127.0.0.1:8000/media/${selectedFile.url}`}
                          alt={selectedFile.nombre}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  p={4}
                  sx={{ bgcolor: '#f8f9fa' }}
                >
                  <Visibility sx={{ fontSize: { xs: 60, md: 80 }, color: '#bdbdbd', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
                    Selecciona un archivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={300}>
                    Haz clic en un archivo de la lista para ver su contenido y opciones
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#f5f5f5', borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
            {selectedTramite?.total_archivos > 0
              ? `${selectedTramite.total_archivos} archivo(s) • ${formatFileSize(getTotalFileSize(selectedTramite.archivos))}`
              : 'Sin archivos'}
          </Typography>
          <Button onClick={handleCloseFiles} variant="contained" color="inherit" sx={{ fontWeight: 600 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MainTable;
