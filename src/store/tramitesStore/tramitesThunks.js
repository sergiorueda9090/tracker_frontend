import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        setFilters, clearFilters, setFilterField } from "./tramitesStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/tramites/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
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
        const tramites = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ tramites, paginado_info }));

      } else {
        console.error("⚠️ Error al obtener trámites:", response);
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

                await dispatch(loadForEditStore({
                    id          : response.data.id ?? null,
                    nombre      : response.data.nombre ?? '',
                    descripcion : response.data.descripcion ?? '',
                    is_active   : response.data.is_active ?? true,
                }));

                await dispatch(openModalShared());
                await dispatch(hideBackDropStore());

            }else{

                await dispatch(hideBackDropStore());

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar trámite",
                        text: "Ocurrió un error al mostrar el trámite.",
                    })
                );

            }


        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar trámite",
                    text: "Ocurrió un error al mostrar el trámite.",
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
                        title: "Trámite creado",
                        text: "El trámite ha sido creado exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear trámite",
                        text: response.data?.error || "Ocurrió un error al crear el trámite.",
                    })
                );

                await dispatch(hideBackDropStore());
            }
        } catch (error) {

                const errorMessage = error.response?.data?.error || "Ocurrió un error al crear el trámite.";

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear trámite",
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
                        title: "Trámite actualizado",
                        text: "El trámite se ha actualizado correctamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar trámite",
                        text: response.data?.error || "Ocurrió un error al actualizar el trámite.",
                    })
                );

                await dispatch(hideBackDropStore());

            }


        } catch (error) {

            await dispatch(hideBackDropStore());

            const errorMessage = error.response?.data?.error || "Ocurrió un error al actualizar el trámite.";

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar trámite",
                    text: errorMessage,
                })
            );

        }

    }

}

export const deleteThunk = (idTramite = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idTramite}${endpoint_delete}`,
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
                        title: "Trámite eliminado",
                        text: "El trámite ha sido eliminado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar el trámite.",
                    })
                );

            }

        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Ocurrió un error al intentar eliminar el trámite.",
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
    const { tramitesStore } = getState();
    const { paginado_info, filters } = tramitesStore;

    await dispatch(setPaginationPage(newPage));

    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      status: filters.status,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { tramitesStore } = getState();
    const { filters } = tramitesStore;

    await dispatch(setPaginationPageSize(newPageSize));

    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
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

    const { tramitesStore } = getState();
    const { paginado_info } = tramitesStore;

    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
      search: filterData.search,
      status: filterData.status,
      start_date: filterData.startDate,
      end_date: filterData.endDate,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    await dispatch(clearFilters());

    const { tramitesStore } = getState();
    const { paginado_info } = tramitesStore;

    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};
