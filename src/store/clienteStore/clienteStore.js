import { createSlice } from '@reduxjs/toolkit'

export const clienteStore = createSlice({
  name: 'clienteStore',
  initialState: {
    // Formulario de cliente (CRUD)
    id: null,
    nombre: '',
    razon_social: '',
    nit: '',
    departamento_id: '',
    ciudad_id: '',
    is_active: true,
    clientes: [],
    paginado_info: {
      count: 0,
      next: null,
      previous: null,
      page_size: 10,
      current_page: 0,
      total_pages: 0,
    },
    filters: {
      search: '',
      departamento: '',
      ciudad: '',
      status: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de cliente
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    handleDataStore: (state, action) => {
      state.clientes = action.payload.clientes;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de cliente
    resetFormStore: (state) => {
      state.id = null;
      state.nombre = '';
      state.razon_social = '';
      state.nit = '';
      state.departamento_id = '';
      state.ciudad_id = '';
      state.is_active = true;
    },
    // Cargar cliente para edición
    loadForEditStore: (state, action) => {
      const cliente = action.payload;
      state.id = cliente.id;
      state.nombre = cliente.nombre || '';
      state.razon_social = cliente.razon_social || '';
      state.nit = cliente.nit || '';
      state.departamento_id = cliente.departamento_id || '';
      state.ciudad_id = cliente.ciudad_id || '';
      state.is_active = cliente.is_active;
    },
    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },
    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1; // Resetear a página 1
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.paginado_info.current_page = 1; // Resetear a página 1 al filtrar
    },
    setFilterField: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        departamento: '',
        ciudad: '',
        status: '',
        startDate: '',
        endDate: '',
      };
      state.paginado_info.current_page = 1;
    },
  },
});

export const {
  handleFormStore,
  resetFormStore,
  loadForEditStore,
  handleDataStore,
  setPaginationPage,
  setPaginationPageSize,
  setFilters,
  setFilterField,
  clearFilters,
} = clienteStore.actions;

export default clienteStore.reducer;
