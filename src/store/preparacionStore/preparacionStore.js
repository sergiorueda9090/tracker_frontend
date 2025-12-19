import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Datos del Formulario de Preparación (CRUD)
  id: null,
  placa: '',
  departamento: '',
  municipio: '',
  tipo_vehiculo: '',
  estado: 'en_verificacion', // en_verificacion, para_radicacion, en_novedad, enviado_tracker
  paquete: '', // URL o nombre del archivo/carpeta
  lista_documentos: [], // Array de objetos {nombre: '', completado: false}
  usuario: '', // Usuario que creó el registro
  created_at: null,

  // Lista de trámites en preparación y control de UI
  tramites: [],
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

  // Filtros avanzados
  filters: {
    search: '',
    estado: '',
    departamento: '',
    municipio: '',
    tipo_vehiculo: '',
    start_date: '',
    end_date: '',
  },
};

export const preparacionStore = createSlice({
  name: 'preparacionStore',
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
      state.tramites = action.payload.tramites;
      state.paginado_info = {
        ...state.paginado_info,
        ...action.payload.paginado_info
      };
    },

    // Limpia el formulario para un nuevo registro
    resetFormStore: (state) => {
      state.id = null;
      state.placa = '';
      state.departamento = '';
      state.municipio = '';
      state.tipo_vehiculo = '';
      state.estado = 'en_verificacion';
      state.paquete = '';
      state.lista_documentos = [];
      state.usuario = '';
      state.created_at = null;
    },

    // Carga un trámite existente en el formulario para edición
    loadForEditStore: (state, action) => {
      const tramite = action.payload;
      state.id = tramite.id;
      state.placa = tramite.placa || '';
      state.departamento = tramite.departamento || '';
      state.municipio = tramite.municipio || '';
      state.tipo_vehiculo = tramite.tipo_vehiculo || '';
      state.estado = tramite.estado || 'en_verificacion';
      state.paquete = tramite.paquete || '';
      state.lista_documentos = tramite.lista_documentos || [];
      state.usuario = tramite.usuario || '';
      state.created_at = tramite.created_at || null;
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

    // Control de loading y errores
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Agregar documento a la lista de chequeo
    addDocumentToList: (state, action) => {
      state.lista_documentos.push({
        nombre: action.payload,
        completado: false
      });
    },

    // Remover documento de la lista
    removeDocumentFromList: (state, action) => {
      state.lista_documentos = state.lista_documentos.filter((_, index) => index !== action.payload);
    },

    // Toggle estado de documento
    toggleDocumentStatus: (state, action) => {
      const index = action.payload;
      if (state.lista_documentos[index]) {
        state.lista_documentos[index].completado = !state.lista_documentos[index].completado;
      }
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
  addDocumentToList,
  removeDocumentFromList,
  toggleDocumentStatus,
} = preparacionStore.actions;

export default preparacionStore.reducer;
