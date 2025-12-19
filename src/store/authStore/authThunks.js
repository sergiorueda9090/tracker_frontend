import axios from "axios";
import { setAuthenticated, loginFail, handleFormStore } from "./authStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/token/";
const namespace_api_user = "/api/user/";
const endpoint           = "me/";

//Función para autenticar usuario
export const getAuth = (username, password, navigate) => {
  return async (dispatch) => {
    try {
      // Mostrar loader
      dispatch(showBackDropStore());

      // Petición de login
      const response = await axios.post(`${URL}${namespace_api}`, { 
        username, 
        password 
      });

      if (response.status === 200 && response.data.access) {
        const token = response.data.access;
        const refreshToken = response.data.refresh; // Guardar también refresh token

        // Petición para obtener información del usuario
        const userResponse = await axios.get(`${URL}${namespace_api_user}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userResponse.data;

        // Guardar en Redux y localStorage
        dispatch(
          setAuthenticated({
            access  : token,
            refresh : refreshToken,
            islogin : true,
            role    : userData.role,
            username: userData.username,
          })
        );

        dispatch(
          showAlert({
            type: "success",
            title: "¡Bienvenido!",
            text: `Hola ${userData.username}, has iniciado sesión correctamente.`,
            confirmText: "Continuar",
            action: () => {
              navigate('/dashboard');
            }
          })
        );

        return { success: true };
      }
    } catch (error) {
      // Manejo de errores
      let errorMessage = "Error desconocido al iniciar sesión.";

      if (error.response) {
        // Error del servidor
        if (error.response.status === 401) {
          errorMessage = "Usuario o contraseña incorrectos.";
        } else if (error.response.status === 400) {
          errorMessage = "Datos inválidos. Verifica tus credenciales.";
        } else if (error.response.status >= 500) {
          errorMessage = "Error en el servidor. Intenta más tarde.";
        } else {
          errorMessage = error.response.data?.detail || 
                        error.response.data?.error || 
                        errorMessage;
        }
      } else if (error.request) {
        // No hay respuesta del servidor
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      dispatch(
        showAlert({
          type: "error",
          title: "Error de autenticación",
          text: errorMessage,
        })
      );

      dispatch(loginFail());
      return { success: false, error: errorMessage };
    } finally {
      // Siempre ocultar loader
      dispatch(hideBackDropStore());
    }
  };
};

export const actionLogout = () => {

    return async (dispatch) => {
    try {
      // Mostrar loader
      dispatch(showBackDropStore());

      dispatch(loginFail());

      return { success: true };

    } catch (error) {

      dispatch(loginFail());

      return { success: true };

    } finally {

      dispatch(hideBackDropStore());

    }

  };

}

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data; // Extraer el nombre y el valor del evento
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};