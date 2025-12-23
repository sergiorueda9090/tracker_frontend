import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        clearFilters, setFilterField, handleDataHistoryStore } from "./trackerStore.js";

import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/tracker/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  estado = "",
  tipo_vehiculo = "",
  proveedor = "",
  departamento = "",
  municipio = "",
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
    if (estado) params.append("estado", estado);
    if (tipo_vehiculo) params.append("tipo_vehiculo", tipo_vehiculo);
    if (proveedor) params.append("proveedor", proveedor);
    if (departamento) params.append("departamento", departamento);
    if (municipio) params.append("municipio", municipio);
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

            if(response.status == 200){

              await dispatch(loadForEditStore
                              (
                                {
                                  id: response.data.id,
                                  placa: response.data.placa,
                                  tipo_vehiculo: response.data.tipo_vehiculo,
                                  departamento: response.data.departamento,
                                  municipio: response.data.municipio,
                                  estado: response.data.estado,
                                  estado_detalle: response.data.estado_detalle,
                                  fecha_recepcion_municipio: response.data.fecha_recepcion_municipio,
                                  proveedor: response.data.proveedor,
                                  preparacion: response.data.preparacion,
                                  usuario: response.data.usuario,
                                  created_at: response.data.created_at,
                                }
                              )
                            );

              await dispatch(openModalShared());

              await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar el trámite",
                        text: "Ocurrió un error al mostrar el trámite.",
                    })
                );

            }


        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar el trámite",
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

            if (response.status == 201) {

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
                        text: "Ocurrió un error al crear el trámite.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            }
        } catch (error) {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear trámite",
                        text: "Ocurrió un error al crear el trámite.",
                    })
                );

            await dispatch(closeModalShared());
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
            data:data
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status == 201 || response.status == 200){

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Trámite actualizado",
                        text: "El trámite se ha actualizado correctamente.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar trámite",
                        text: "Ocurrió un error al actualizar el trámite.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );

            }


        } catch (error) {

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar trámite",
                    text: "Ocurrió un error al actualizar el trámite.",
                })
            );
            console.error(error);

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

            await dispatch( hideBackDropStore() );

            if(response.status == 204){

                await dispatch( getAllThunks() );

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
                        text:  "Ocurrió un error al intentar eliminar el trámite. Inténtalo nuevamente.",
                    })
                );

            }

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Servidor Ocurrió un error al intentar eliminar el trámite. Inténtalo nuevamente.",
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

/* TRAZABILIDAD HISTORY */
export const showhistoryThunk = (id = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'GET',
            url: `${URL}${namespace_api}${id}/history/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status == 200){

              await dispatch(handleDataHistoryStore({ history: response.data.history }));

              await dispatch(openModalShared());

              await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar el trámite",
                        text: "Ocurrió un error al mostrar el trámite.",
                    })
                );

            }


        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar el trámite",
                    text: "Ocurrió un error al mostrar el trámite.",
                })
            );

        }

    }

}

/* Paginación */
export const handlePageChange = (newPage) => {
  return async (dispatch, getState) => {
    const { trackerStore } = getState();
    const { paginado_info, filters } = trackerStore;

    // Actualizar la página en Redux
    await dispatch(setPaginationPage(newPage));

    // Llamar al endpoint con la nueva página
    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      estado: filters.estado,
      tipo_vehiculo: filters.tipo_vehiculo,
      proveedor: filters.proveedor,
      departamento: filters.departamento,
      municipio: filters.municipio,
      start_date: filters.start_date,
      end_date: filters.end_date,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { trackerStore } = getState();
    const { filters } = trackerStore;

    // Actualizar el page_size en Redux
    await dispatch(setPaginationPageSize(newPageSize));

    // Llamar al endpoint con el nuevo tamaño (página 1)
    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      estado: filters.estado,
      tipo_vehiculo: filters.tipo_vehiculo,
      proveedor: filters.proveedor,
      departamento: filters.departamento,
      municipio: filters.municipio,
      start_date: filters.start_date,
      end_date: filters.end_date,
    }));
  };
};

/* filtros */
export const filterFieldThunk = (data) => {
    return async (dispatch) => {
      console.log("Dispatching filterFieldThunk with data:", data);
      dispatch(setFilterField({ field: data.field, value: data.value }));
    };
};

export const applyFilters = (filterData) => {
  return async (dispatch, getState) => {
    const { trackerStore } = getState();
    const { paginado_info } = trackerStore;

    // Llamar al endpoint con los nuevos filtros
    await dispatch(getAllThunks({
      page: 1, // Volver a la primera página
      page_size: paginado_info.page_size,
      search: filterData.search,
      estado: filterData.estado,
      tipo_vehiculo: filterData.tipo_vehiculo,
      proveedor: filterData.proveedor,
      departamento: filterData.departamento,
      municipio: filterData.municipio,
      start_date: filterData.start_date,
      end_date: filterData.end_date,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    // Limpiar filtros en Redux
    await dispatch(clearFilters());

    const { trackerStore } = getState();
    const { paginado_info } = trackerStore;

    // Llamar al endpoint sin filtros
    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};
