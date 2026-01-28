
// ===== URL API =====
export const URL  = 'https://tracker.movilidad2a.com'; // Producción
//export const URL = 'http://127.0.0.1:8000'; // Local

// ===== URL WebSocket =====
export const URL_WEBSOCKET = 'wss://tracker.movilidad2a.com'; // Producción
//export const URL_WEBSOCKET = 'ws://127.0.0.1:8000'; // Local

export const TOKEN = (() => {
    const token = localStorage.getItem("access"); // Obtener el valor almacenado

    // Validar que el token no sea null, vacío o undefined
    if (token && token !== 'null' && token !== 'undefined') {
        return JSON.parse(token); // Convertir el valor de string a JSON
    }

    // Si no es válido, retorna null o maneja el caso según lo necesario
    return null;
})();