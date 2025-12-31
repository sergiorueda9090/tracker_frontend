import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTramiteStore,
  updateTramiteStore,
  removeTramiteStore
} from "../store/archivadasStore/archivadasStore";
import { getAllThunks, deleteThunk } from '../store/archivadasStore/archivadasThunks';

// Hook de WebSocket
import useWebSocket from './hooks/useWebSocket';

const Main = () => {
  const dispatch = useDispatch();
  const { tramites, isLoading } = useSelector(state => state.archivadasStore);

  // Conectar a WebSocket
  const { isConnected, lastMessage } = useWebSocket('/ws/archivadas/');

  // Estado para notificaciones
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  // Manejar mensajes recibidos del WebSocket
  useEffect(() => {
    if (lastMessage) {
      console.log('📩 Nuevo mensaje WebSocket Archivadas:', lastMessage);

      // Conexión establecida
      if (lastMessage.type === 'connection_established') {
        setNotification({
          open: true,
          message: '✅ Conectado a actualizaciones de Archivadas en tiempo real',
          severity: 'success'
        });
      }

      // Nuevo trámite archivado creado
      else if (lastMessage.type === 'archivada_created') {
        dispatch(addTramiteStore(lastMessage.data));
        setNotification({
          open: true,
          message: `🆕 Nuevo trámite archivado: ${lastMessage.data.placa}`,
          severity: 'success'
        });
      }

      // Trámite archivado actualizado
      else if (lastMessage.type === 'archivada_updated') {
        dispatch(updateTramiteStore(lastMessage.data));
        setNotification({
          open: true,
          message: `✏️ Trámite actualizado: ${lastMessage.data.placa}`,
          severity: 'info'
        });
      }

      // Trámite archivado eliminado
      else if (lastMessage.type === 'archivada_deleted') {
        dispatch(removeTramiteStore(lastMessage.data.id));
        setNotification({
          open: true,
          message: `🗑️ Trámite eliminado de archivadas`,
          severity: 'warning'
        });
      }
    }
  }, [lastMessage, dispatch]);

  // Handler para eliminar
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este trámite archivado?')) {
      dispatch(deleteThunk(id));
    }
  };

  // Handler para cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ArchiveIcon sx={{ fontSize: 40, color: '#00A859' }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Trámites Archivados
          </Typography>
          <Chip
            label={isConnected ? 'WebSocket Conectado' : 'WebSocket Desconectado'}
            color={isConnected ? 'success' : 'error'}
            size="small"
          />
        </Box>
        <Chip label={`Total: ${tramites.length}`} color="primary" />
      </Box>

      {/* Tabla de Trámites */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Placa</strong></TableCell>
              <TableCell><strong>Tipo Vehículo</strong></TableCell>
              <TableCell><strong>Departamento</strong></TableCell>
              <TableCell><strong>Municipio</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell><strong>Fecha Creación</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Cargando trámites archivados...
                </TableCell>
              </TableRow>
            ) : tramites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box sx={{ py: 4 }}>
                    <ArchiveIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      No hay trámites archivados
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              tramites.map((tramite) => (
                <TableRow key={tramite.id} hover>
                  <TableCell>{tramite.id}</TableCell>
                  <TableCell>
                    <strong>{tramite.placa}</strong>
                  </TableCell>
                  <TableCell>{tramite.tipo_vehiculo}</TableCell>
                  <TableCell>{tramite.nombre_depto || '-'}</TableCell>
                  <TableCell>{tramite.nombre_muni || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={tramite.estado}
                      size="small"
                      color={tramite.estado === 'finalizado' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{tramite.usuario || 'Sin asignar'}</TableCell>
                  <TableCell>
                    {tramite.created_at ? new Date(tramite.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Detalles">
                      <IconButton size="small" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(tramite.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Main;
