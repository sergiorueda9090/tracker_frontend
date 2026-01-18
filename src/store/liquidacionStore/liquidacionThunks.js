import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        clearFilters, setFilterField, setEstadisticas } from "./liquidacionStore.js";

import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/liquidacion/";
const endpoint           = "list/";
const endpoint_update    = "update/";
const endpoint_estadisticas = "estadisticas/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  estado = "",
  tramite = "",
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
    if (tramite) params.append("tramite", tramite);
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
        const liquidaciones = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ liquidaciones, paginado_info }));

      } else {
        console.error("Error al obtener liquidaciones:", response);
      }
    } catch (error) {
      console.error("Error en el servidor:", error);
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

              await dispatch(loadForEditStore(response.data));

              await dispatch(openModalShared());

              await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar la liquidación",
                        text: "Ocurrió un error al mostrar la liquidación.",
                    })
                );

            }


        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar la liquidación",
                    text: "Ocurrió un error al mostrar la liquidación.",
                })
            );

        }

    }

}

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
                        title: "Liquidación actualizada",
                        text: "La liquidación se ha actualizado correctamente.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar liquidación",
                        text: "Ocurrió un error al actualizar la liquidación.",
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
                    title: "Error al actualizar liquidación",
                    text: "Ocurrió un error al actualizar la liquidación.",
                })
            );
            console.error(error);

        }

    }

}

export const getEstadisticasThunk = ({
  start_date = "",
  end_date = "",
} = {}) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        let params = new URLSearchParams();
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);

        const options = {
            method: 'GET',
            url: `${URL}${namespace_api}${endpoint_estadisticas}?${params.toString()}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            const response = await axios.request(options);

            if(response.status == 200){
              await dispatch(setEstadisticas(response.data));
            }else{
                console.error("Error al obtener estadísticas:", response);
            }

        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
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
    const { liquidacionStore } = getState();
    const { paginado_info, filters } = liquidacionStore;

    // Actualizar la página en Redux
    await dispatch(setPaginationPage(newPage));

    // Llamar al endpoint con la nueva página
    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      estado: filters.estado,
      tramite: filters.tramite,
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
    const { liquidacionStore } = getState();
    const { filters } = liquidacionStore;

    // Actualizar el page_size en Redux
    await dispatch(setPaginationPageSize(newPageSize));

    // Llamar al endpoint con el nuevo tamaño (página 1)
    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      estado: filters.estado,
      tramite: filters.tramite,
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
      dispatch(setFilterField({ field: data.field, value: data.value }));
    };
};

export const applyFilters = (filterData) => {
  return async (dispatch, getState) => {
    const { liquidacionStore } = getState();
    const { paginado_info } = liquidacionStore;

    // Llamar al endpoint con los nuevos filtros
    await dispatch(getAllThunks({
      page: 1, // Volver a la primera página
      page_size: paginado_info.page_size,
      search: filterData.search,
      estado: filterData.estado,
      tramite: filterData.tramite,
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

    const { liquidacionStore } = getState();
    const { paginado_info } = liquidacionStore;

    // Llamar al endpoint sin filtros
    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};
