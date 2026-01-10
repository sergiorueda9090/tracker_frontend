import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        setFilters, clearFilters, setFilterField } from "./clienteStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/clientes/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  departamento = "",
  ciudad = "",
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
    if (departamento) params.append("departamento", departamento);
    if (ciudad) params.append("ciudad", ciudad);
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
        const clientes = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ clientes, paginado_info }));

      } else {
        console.error("⚠️ Error al obtener clientes:", response);
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
                    id             : response.data.id ?? null,
                    nombre         : response.data.nombre ?? '',
                    razon_social   : response.data.razon_social ?? '',
                    nit            : response.data.nit ?? '',
                    departamento_id: response.data.departamento_id ?? '',
                    ciudad_id      : response.data.ciudad_id ?? '',
                    is_active      : response.data.is_active ?? true,
                }));

                await dispatch(openModalShared());
                await dispatch(hideBackDropStore());

            }else{

                await dispatch(hideBackDropStore());

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar cliente",
                        text: "Ocurrió un error al mostrar el cliente.",
                    })
                );

            }


        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar cliente",
                    text: "Ocurrió un error al mostrar el cliente.",
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
                        title: "Cliente creado",
                        text: "El cliente ha sido creado exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear cliente",
                        text: response.data?.error || "Ocurrió un error al crear el cliente.",
                    })
                );

                await dispatch(hideBackDropStore());
            }
        } catch (error) {

                const errorMessage = error.response?.data?.error || "Ocurrió un error al crear el cliente.";

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear cliente",
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
                        title: "Cliente actualizado",
                        text: "El cliente se ha actualizado correctamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar cliente",
                        text: response.data?.error || "Ocurrió un error al actualizar el cliente.",
                    })
                );

                await dispatch(hideBackDropStore());

            }


        } catch (error) {

            await dispatch(hideBackDropStore());

            const errorMessage = error.response?.data?.error || "Ocurrió un error al actualizar el cliente.";

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar cliente",
                    text: errorMessage,
                })
            );

        }

    }

}

export const deleteThunk = (idCliente = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idCliente}${endpoint_delete}`,
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
                        title: "Cliente eliminado",
                        text: "El cliente ha sido eliminado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar el cliente.",
                    })
                );

            }

        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Ocurrió un error al intentar eliminar el cliente.",
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
    const { clienteStore } = getState();
    const { paginado_info, filters } = clienteStore;

    await dispatch(setPaginationPage(newPage));

    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      departamento: filters.departamento,
      ciudad: filters.ciudad,
      status: filters.status,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { clienteStore } = getState();
    const { filters } = clienteStore;

    await dispatch(setPaginationPageSize(newPageSize));

    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      departamento: filters.departamento,
      ciudad: filters.ciudad,
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

    const { clienteStore } = getState();
    const { paginado_info } = clienteStore;

    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
      search: filterData.search,
      departamento: filterData.departamento,
      ciudad: filterData.ciudad,
      status: filterData.status,
      start_date: filterData.startDate,
      end_date: filterData.endDate,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    await dispatch(clearFilters());

    const { clienteStore } = getState();
    const { paginado_info } = clienteStore;

    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};
