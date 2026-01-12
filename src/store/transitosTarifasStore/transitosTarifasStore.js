import { createSlice } from '@reduxjs/toolkit'

export const transitosTarifasStore = createSlice({
  name: 'transitosTarifasStore',
  initialState: {
    // Formulario de tránsito tarifa (CRUD)
    id: null,
    tramite_id: '',
    proveedor_id: '',
    servicio_proveedor: '',
    servicio_empresa: '',
    is_active: true,
    transito_tarifas: [],
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
      tramite: '',
      proveedor: '',
      status: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de tránsito tarifa
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    handleDataStore: (state, action) => {
      state.transito_tarifas = action.payload.transito_tarifas;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de tránsito tarifa
    resetFormStore: (state) => {
      state.id = null;
      state.tramite_id = '';
      state.proveedor_id = '';
      state.servicio_proveedor = '';
      state.servicio_empresa = '';
      state.is_active = true;
    },
    // Cargar tránsito tarifa para edición
    loadForEditStore: (state, action) => {
      const transitoTarifa = action.payload;
      state.id = transitoTarifa.id;
      state.tramite_id = transitoTarifa.tramite_id || '';
      state.proveedor_id = transitoTarifa.proveedor_id || '';
      state.servicio_proveedor = transitoTarifa.servicio_proveedor || '';
      state.servicio_empresa = transitoTarifa.servicio_empresa || '';
      state.is_active = transitoTarifa.is_active;
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
        tramite: '',
        proveedor: '',
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
} = transitosTarifasStore.actions;

export default transitosTarifasStore.reducer;
