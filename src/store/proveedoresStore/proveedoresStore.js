import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Datos del Formulario de Proveedor (CRUD)
  id: null,
  nombre: '',
  whatsapp: '',
  departamento: '',
  municipio: '',
  transitos_habilitados: [],  // ✅ Cambiado de '' a [] (es JSONField)
  codigo_encargado: '',
  is_active: true,

  // Lista de proveedores y control de UI
  providers: [],
  isLoading: false,
  error: null,

  // Información de paginación estandarizada
  paginado_info: {
    count: 0,
    next: null,
    previous: null,
    page_size: 10,
    current_page: 1,
    total_pages: 0,
  },

  // Filtros avanzados para la red de proveedores
  filters: {
    search: '',
    departamento: '',
    municipio: '',
    status: '',
    start_date: '',  // ✅ Agregado
    end_date: '',    // ✅ Agregado
  },
};

export const proveedoresStore = createSlice({
  name: 'proveedoresStore',
  initialState,
  reducers: {
    // Actualiza cualquier campo del formulario dinámicamente
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      if (name in state) {
        state[name] = value;
      }
    },

    // Carga los datos recibidos de la API (Lista y Paginación)
    handleDataStore: (state, action) => {
      state.providers = action.payload.providers;
      state.paginado_info = {
        ...state.paginado_info,
        ...action.payload.paginado_info
      };
    },

    // Limpia el formulario para un nuevo registro
    resetFormStore: (state) => {
      state.id = null;
      state.nombre = '';
      state.whatsapp = '';
      state.departamento = '';
      state.municipio = '';
      state.transitos_habilitados = [];  // ✅ Array vacío
      state.codigo_encargado = '';
      state.is_active = true;
    },

    // Carga un proveedor existente en el formulario para edición
    loadForEditStore: (state, action) => {
      const provider = action.payload;
      state.id            = provider.id;
      state.nombre        = provider.nombre || '';
      state.whatsapp      = provider.whatsapp || '';
      state.departamento  = provider.departamento || '';
      state.municipio     = provider.municipio || '';
      state.transitos_habilitados = provider.transitos_habilitados || [];  // ✅ Array vacío por defecto
      state.codigo_encargado      = provider.codigo_encargado || '';
      state.is_active             = provider.is_active ?? true;
    },

    // Control de paginación
    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },

    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1;
    },

    // Control de filtros
    setFilterField: (state, action) => {
      const { field, value } = action.payload;
      if (field in state.filters) {
        state.filters[field] = value;
      }
      state.paginado_info.current_page = 1;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.paginado_info.current_page = 1;
    },

    //Control de loading y errores
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
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
  setFilterField,
  clearFilters,
  setLoading,
  setError,
} = proveedoresStore.actions;

export default proveedoresStore.reducer;