import React, { useEffect } from 'react';
import { Box, Snackbar, Alert, Chip } from '@mui/material';
import MainHeader from './components/MainHeader';
import MainTable from './components/MainTable';
import MainDialog from './components/MainDialog';

import { openModalShared, closeModalShared } from "../store/globalStore/globalStore";
import { resetFormStore } from "../store/preparacionStore/preparacionStore";
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
      console.log('Nuevo mensaje WebSocket:', lastMessage);
      
      // Ejemplo: Mostrar notificación cuando llega un mensaje
      if (lastMessage.type === 'connection_established') {
        setNotification({
          open: true,
          message: lastMessage.message,
          severity: 'success'
        });
      } else if (lastMessage.type === 'message') {
        setNotification({
          open: true,
          message: lastMessage.echo || lastMessage.message,
          severity: 'info'
        });
      }

      // Aquí puedes manejar actualizaciones de tu tabla
      // Por ejemplo, si recibes un evento de actualización de preparación:
      // if (lastMessage.type === 'preparacion_updated') {
      //   dispatch(fetchPreparaciones()); // Recargar datos
      // }
    }
  }, [lastMessage]);

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

  // Función de prueba para enviar mensajes
  const handleTestMessage = () => {
    sendMessage({
      message: 'Mensaje de prueba desde React'
    });
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
      <MainHeader 
        onAddNew={() => handleOpenDialog()}
        // Botón adicional de prueba (temporal)
        onTest={handleTestMessage}
      />

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