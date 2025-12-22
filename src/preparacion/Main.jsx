import React, { useEffect } from 'react';
import { Box, Snackbar, Alert, Chip } from '@mui/material';
import MainHeader from './components/MainHeader';
import MainTable from './components/MainTable';
import MainDialog from './components/MainDialog';

import { openModalShared, closeModalShared } from "../store/globalStore/globalStore";
import {
  resetFormStore,
  addTramiteRealtime,
  updateTramiteRealtime,
  deleteTramiteRealtime,
  deleteArchivoRealtime
} from "../store/preparacionStore/preparacionStore";
import { useSelector, useDispatch } from 'react-redux';

import '../styles/Pages.css';
import Filter from './components/Filter';
import { SimpleBackdrop } from '../components/Backdrop/BackDrop';

// Importar el hook de WebSocket
import useWebSocket from './hooks/useWebSocket';

const Main = () => {
  const dispatch = useDispatch();
  const { openModalStore } = useSelector(state => state.globalStore);

  // Conectar a WebSocket
  const { isConnected, lastMessage, sendMessage } = useWebSocket('/ws/preparacion/');

  // Estado para notificaciones
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Manejar mensajes recibidos del WebSocket
  useEffect(() => {
    if (lastMessage) {
      console.log('📩 Nuevo mensaje WebSocket:', lastMessage);

      // Conexión establecida
      if (lastMessage.type === 'connection_established') {
        setNotification({
          open: true,
          message: '✅ Conectado a actualizaciones en tiempo real',
          severity: 'success'
        });
      }

      // Nueva preparación creada
      else if (lastMessage.type === 'preparacion_created') {

        dispatch(addTramiteRealtime(lastMessage.data));
        
        setNotification({
          open: true,
          message: `🆕 Nuevo trámite creado: ${lastMessage.data.placa}`,
          severity: 'info'
        });

      }
      
      // Preparación actualizada
      else if (lastMessage.type === 'preparacion_updated') {
        dispatch(updateTramiteRealtime(lastMessage.data));
        setNotification({
          open: true,
          message: `✏️ Trámite actualizado: ${lastMessage.data.placa}`,
          severity: 'info'
        });
      }

      // Preparación eliminada
      else if (lastMessage.type === 'preparacion_deleted') {
        dispatch(deleteTramiteRealtime(lastMessage.data.id));
        setNotification({
          open: true,
          message: `🗑️ Trámite eliminado: ${lastMessage.data.placa || 'ID: ' + lastMessage.data.id}`,
          severity: 'warning'
        });
      }

      // Cambio de estado
      else if (lastMessage.type === 'preparacion_status_changed') {
        dispatch(updateTramiteRealtime(lastMessage.data));
        setNotification({
          open: true,
          message: `🔄 Estado actualizado: ${lastMessage.data.placa}`,
          severity: 'info'
        });
      }

      // Archivo eliminado
      else if (lastMessage.type === 'archivo_deleted') {
        dispatch(deleteArchivoRealtime({
          tramite_id: lastMessage.data.tramite_id,
          archivo_id: lastMessage.data.archivo_id
        }));
        setNotification({
          open: true,
          message: `📎 Archivo eliminado: ${lastMessage.data.nombre_archivo}`,
          severity: 'warning'
        });
      }
    }
  }, [lastMessage, dispatch]);

  // Handlers del Dialog
  const handleOpenDialog = () => {
    dispatch(resetFormStore());
    dispatch(openModalShared());
  };

  const handleCloseDialog = () => {
    dispatch(closeModalShared());
  };

  // Handler para cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box className="page-container">
      {/* Indicador de conexión WebSocket */}
      <Box sx={{ position: 'fixed', top: 70, right: 16, zIndex: 9999 }}>
        <Chip
          label={isConnected ? 'Conectado' : 'Desconectado'}
          color={isConnected ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Header con título y botón de nuevo trámite */}
      <MainHeader onAddNew={() => handleOpenDialog()} />

      {/* Filtros */}
      <Filter />

      {/* Tabla de trámites */}
      <MainTable />

      {/* Dialog de crear/editar */}
      <MainDialog open={openModalStore} onClose={handleCloseDialog} />

      {/* Backdrop */}
      <SimpleBackdrop />

      {/* Notificaciones WebSocket */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Main;