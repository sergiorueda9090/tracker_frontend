import { useEffect, useRef, useState } from 'react';
import { URL_WEBSOCKET } from '../../constants/constantGlogal';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    // Crear conexión WebSocket
    const wsUrl = url.startsWith('ws') ? url : `${URL_WEBSOCKET}${url}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket Tracker conectado');
      setIsConnected(true);
      setError(null);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 Mensaje Tracker recibido:', data);
        setLastMessage(data);
      } catch (err) {
        console.error('Error al parsear mensaje:', err);
      }
    };

    ws.current.onerror = (error) => {
      console.error('❌ Error en WebSocket Tracker:', error);
      setError(error);
    };

    ws.current.onclose = () => {
      console.log('🔌 WebSocket Tracker desconectado');
      setIsConnected(false);
    };

    // Cleanup al desmontar
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  // Función para enviar mensajes
  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log('📤 Mensaje Tracker enviado:', message);
    } else {
      console.warn('⚠️ WebSocket Tracker no está conectado');
    }
  };

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
  };
};

export default useWebSocket;
