import { createSlice } from '@reduxjs/toolkit'

export const tramitesStore = createSlice({
  name: 'tramitesStore',
  initialState: {
    // Formulario de trámite (CRUD)
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    is_active: true,
    tramites: [],
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
      status: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de trámite
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    handleDataStore: (state, action) => {
      state.tramites = action.payload.tramites;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de trámite
    resetFormStore: (state) => {
      state.id = null;
      state.nombre = '';
      state.descripcion = '';
      state.precio = '';
      state.is_active = true;
    },
    // Cargar trámite para edición
    loadForEditStore: (state, action) => {
      const tramite = action.payload;
      state.id = tramite.id;
      state.nombre = tramite.nombre || '';
      state.descripcion = tramite.descripcion || '';
      state.precio = tramite.precio || '';
      state.is_active = tramite.is_active;
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
} = tramitesStore.actions;

export default tramitesStore.reducer;
