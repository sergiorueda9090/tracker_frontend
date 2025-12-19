import axios from "axios";
import { handleFormStore, hanbleDataDepartamentosStore, hanbleDataMunicipiosStore } from "./departamentosMunicipiosStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api            = "/api/departamentos/";
const namespace_api_municipios = "/api/municipios/";
const endpoint                 = "list/";


export const getAllThunks = () => {

  return async (dispatch, getState) => {

    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    const options = {
      method: "GET",
      url: `${URL}${namespace_api}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const departamentos = response.data.departamentos || [];

        await dispatch(hanbleDataDepartamentosStore({ departamentos }));

      } else {
        console.error("⚠️ Error al obtener departamentos:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};

export const showThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}${namespace_api_municipios}${endpoint}${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){

                const municipios = response.data.municipios || [];

                await dispatch(hanbleDataMunicipiosStore({ municipios}));

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar los municipios",
                        text: "Ocurrió un error al mostrar los municipios.",
                    })
                );
 
            }
            

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar los municipios",
                    text: "Ocurrió un error al mostrar los municipios.",
                })
            );
       
        }

    }

}

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data; // Extraer el nombre y el valor del evento
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};
