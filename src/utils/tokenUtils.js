/**
 * Utilidades para manejo de tokens JWT
 */

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - Token JWT a verificar
 * @returns {boolean} - true si está expirado, false si es válido
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Decodificar el payload del JWT (segunda parte)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Verificar si tiene el campo 'exp' (expiration time en segundos)
    if (!payload.exp) return true;

    // Comparar con el tiempo actual (en segundos)
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true; // Si hay error al decodificar, considerar como expirado
  }
};

/**
 * Obtiene la información del payload del token sin verificar la firma
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload decodificado o null si hay error
 */
export const getTokenPayload = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error al decodificar payload del token:', error);
    return null;
  }
};

/**
 * Calcula el tiempo restante hasta que expire el token
 * @param {string} token - Token JWT
 * @returns {number} - Segundos restantes hasta la expiración, o 0 si ya expiró
 */
export const getTokenTimeRemaining = (token) => {
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = payload.exp - currentTime;

    return timeRemaining > 0 ? timeRemaining : 0;
  } catch (error) {
    console.error('Error al calcular tiempo restante del token:', error);
    return 0;
  }
};
