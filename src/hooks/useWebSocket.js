// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { URL_WEBSOCKET } from '../constants/constantGlogal.js';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    // Función para obtener el token del localStorage
    const getToken = () => {
      try {
        // Primero intentar obtener de infoUser (tu caso)
        const infoUserStr = localStorage.getItem('infoUser');
        if (infoUserStr) {
          const infoUser = JSON.parse(infoUserStr);
          if (infoUser && infoUser.access) {
            console.log('✅ Token encontrado en infoUser.access');
            return infoUser.access;
          }
        }

        // Fallback: intentar otros nombres comunes
        const possibleKeys = [
          'access_token',
          'accessToken', 
          'token',
          'authToken',
          'access',
          'jwt_token'
        ];

        for (const key of possibleKeys) {
          const token = localStorage.getItem(key);
          if (token) {
            console.log(`✅ Token encontrado en localStorage: ${key}`);
            return token;
          }
        }

        // Si no hay token
        console.warn('⚠️ No se encontró token JWT en localStorage');
        console.log('📋 Claves disponibles:', Object.keys(localStorage));
        return null;
      } catch (error) {
        console.error('❌ Error al obtener token:', error);
        return null;
      }
    };

    const token = getToken();
    
    // Crear conexión WebSocket
    let wsUrl = url.startsWith('ws') ? url : `${URL_WEBSOCKET}${url}`;
    
    // Agregar token si existe
    if (token) {
      const separator = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${separator}token=${token}`;
      console.log(`🔐 Conectando WebSocket con autenticación`);
      console.log(`   URL: ${url}`);
      console.log(`   Token (primeros 20 chars): ${token.substring(0, 20)}...`);
    } else {
      console.log(`🔓 Conectando WebSocket SIN autenticación: ${url}`);
    }
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`✅ WebSocket conectado: ${url}`);
      setIsConnected(true);
      setError(null);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📩 Mensaje recibido en ${url}:`, data);
        setLastMessage(data);
      } catch (err) {
        console.error('Error al parsear mensaje:', err);
      }
    };

    ws.current.onerror = (error) => {
      console.error(`❌ Error en WebSocket ${url}:`, error);
      setError(error);
    };

    ws.current.onclose = (event) => {
      console.log(`🔌 WebSocket desconectado: ${url}`);
      console.log(`   Código: ${event.code}, Razón: ${event.reason || 'Sin razón especificada'}`);
      setIsConnected(false);
    };

    // Cleanup al desmontar
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log(`🔌 Cerrando WebSocket: ${url}`);
        ws.current.close();
      }
    };
  }, [url]);

  // Función para enviar mensajes
  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log(`📤 Mensaje enviado a ${url}:`, message);
    } else {
      console.warn(`⚠️ WebSocket no está conectado: ${url}`);
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