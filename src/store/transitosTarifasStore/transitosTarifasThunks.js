import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        setFilters, clearFilters, setFilterField, handleDataLocationStore } from "./transitosTarifasStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api        = "/api/transitotarifas/";
const tramites_by_location = "tramites-by-location/";
const endpoint             = "list/";
const endpoint_delete      = "/delete/";
const endpoint_create      = "create/";
const endpoint_update     = "update/";


export const getTramitesByLocationThunks = (departamento_id = "", municipio_id = "") => {

    return async (dispatch, getState) => {
        const {authStore} = getState();
        const token       = authStore.token
        await dispatch(showBackDropStore());
        const options = {
            method: 'GET',
            url: `${URL}${namespace_api}${tramites_by_location}?departamento_id=${departamento_id}&municipio_id=${municipio_id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
            try {
            // Hacer la solicitud
            const response = await axios.request(options);
            if(response.status === 200){
                dispatch(handleDataLocationStore({ tramite_by_location: response.data.tramites }));
            }else{
                dispatch(handleDataLocationStore({ tramite_by_location: [] }));
                console.error("⚠️ Error al obtener trámites por ubicación:", response);
            }
        } catch (error) {
            console.error("❌ Error en el servidor:", error);
            dispatch(handleDataLocationStore({ tramite_by_location: [] }));
            return [];
        } finally {
            await dispatch(hideBackDropStore());
        }
    }

}


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  tramite = "",
  proveedor = "",
  departamento = "",
  municipio = "",
  status = "",
  start_date = "",
  end_date = "",
} = {}) => {

  return async (dispatch, getState) => {

    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir los parámetros dinámicamente
    let params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", page_size);

    if (search) params.append("search", search);
    if (tramite) params.append("tramite", tramite);
    if (proveedor) params.append("proveedor", proveedor);
    if (departamento) params.append("departamento", departamento);
    if (municipio) params.append("municipio", municipio);
    if (status) params.append("status", status);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);

    const options = {
      method: "GET",
      url: `${URL}${namespace_api}${endpoint}?${params.toString()}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const transito_tarifas = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ transito_tarifas, paginado_info }));

      } else {
        console.error("⚠️ Error al obtener tránsitos tarifas:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};

export const showThunk = (id = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'GET',
            url: `${URL}${namespace_api}${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status === 200){

                // Transformar datos del backend al formato del frontend
                const tramites_data = response.data.tramites.map(tramite => ({
                    tramite_id: tramite.tramite_id,
                    nombre_tramite: tramite.tramite_nombre || '',
                    derechos_2026: tramite.derechos_2026 || '',
                    gestores: tramite.gestores.map(gestor => ({
                        proveedor_id: gestor.proveedor_id,
                        nombre: gestor.proveedor_nombre || '',
                        codigo: gestor.proveedor_codigo || '',
                        servicio_gestor: gestor.servicio_gestor || '',
                        servicio_empresa: gestor.servicio_empresa || '',
                    })),
                }));

                await dispatch(loadForEditStore({
                    id                  : response.data.id ?? null,
                    departamento_id     : response.data.departamento_id ?? '',
                    municipio_id        : response.data.municipio_id ?? '',
                    tramites_data       : tramites_data,
                    is_active           : response.data.is_active ?? true,
                }));

                await dispatch(openModalShared());
                await dispatch(hideBackDropStore());

            }else{

                await dispatch(hideBackDropStore());

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar tránsito tarifa",
                        text: "Ocurrió un error al mostrar el tránsito tarifa.",
                    })
                );

            }


        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar tránsito tarifa",
                    text: "Ocurrió un error al mostrar el tránsito tarifa.",
                })
            );

        }

    }

}

export const createThunks = (data) => {

    return async (dispatch, getState) => {

        const { authStore } = getState();

        const token = authStore.token;

        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}${endpoint_create}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: data,
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if (response.status === 201) {

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Tránsito tarifa creada",
                        text: "El tránsito tarifa ha sido creada exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear tránsito tarifa",
                        text: response.data?.error || "Ocurrió un error al crear el tránsito tarifa.",
                    })
                );

                await dispatch(hideBackDropStore());
            }
        } catch (error) {

                const errorMessage = error.response?.data?.error || "Ocurrió un error al crear el tránsito tarifa.";

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear tránsito tarifa",
                        text: errorMessage,
                    })
                );

            await dispatch(hideBackDropStore());

        }
    };
};

export const updateThunks = (id, data) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'PUT',
            url: `${URL}${namespace_api}${id}/${endpoint_update}`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status === 200){

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Tránsito tarifa actualizada",
                        text: "El tránsito tarifa se ha actualizado correctamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar tránsito tarifa",
                        text: response.data?.error || "Ocurrió un error al actualizar el tránsito tarifa.",
                    })
                );

                await dispatch(hideBackDropStore());

            }


        } catch (error) {

            await dispatch(hideBackDropStore());

            const errorMessage = error.response?.data?.error || "Ocurrió un error al actualizar el tránsito tarifa.";

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar tránsito tarifa",
                    text: errorMessage,
                })
            );

        }

    }

}

export const deleteThunk = (idTransitoTarifa = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idTransitoTarifa}${endpoint_delete}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            await dispatch(hideBackDropStore());

            if(response.status === 204){

                await dispatch(getAllThunks());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Tránsito tarifa eliminada",
                        text: "El tránsito tarifa ha sido eliminada exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar el tránsito tarifa.",
                    })
                );

            }

        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Ocurrió un error al intentar eliminar el tránsito tarifa.",
                })
            );

        }

    }

}

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data;
      dispatch(handleFormStore({ name, value }));
    };
};

/* Paginación */
export const handlePageChange = (newPage) => {
  return async (dispatch, getState) => {
    const { transitosTarifasStore } = getState();
    const { paginado_info, filters } = transitosTarifasStore;

    await dispatch(setPaginationPage(newPage));

    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      tramite: filters.tramite,
      proveedor: filters.proveedor,
      departamento: filters.departamento,
      municipio: filters.municipio,
      status: filters.status,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { transitosTarifasStore } = getState();
    const { filters } = transitosTarifasStore;

    await dispatch(setPaginationPageSize(newPageSize));

    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      tramite: filters.tramite,
      proveedor: filters.proveedor,
      departamento: filters.departamento,
      municipio: filters.municipio,
      status: filters.status,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

/* filtros */
export const filterFieldThunk = (data) => {
    return async (dispatch) => {
        dispatch(setFilterField({ field: data.field, value: data.value }));
    };
};

export const applyFilters = (filterData) => {
  return async (dispatch, getState) => {
    await dispatch(setFilters(filterData));

    const { transitosTarifasStore } = getState();
    const { paginado_info } = transitosTarifasStore;

    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
      search: filterData.search,
      tramite: filterData.tramite,
      proveedor: filterData.proveedor,
      departamento: filterData.departamento,
      municipio: filterData.municipio,
      status: filterData.status,
      start_date: filterData.startDate,
      end_date: filterData.endDate,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    await dispatch(clearFilters());

    const { transitosTarifasStore } = getState();
    const { paginado_info } = transitosTarifasStore;

    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};
