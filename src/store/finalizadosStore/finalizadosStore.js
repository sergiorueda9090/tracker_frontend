import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Datos del Formulario de Finalizados (CRUD) - Usa modelo Preparacion con estado_modulo=3
  id: null,
  placa: '',
  departamento: '',
  municipio: '',
  tipo_vehiculo: '',
  estado: 'finalizado', // Estado por defecto para finalizados
  estado_tracker: 'finalizado', // Estado tracker por defecto
  estado_detalle: '',
  fecha_recepcion_municipio: '',
  proveedor: '',
  paquete: '',
  lista_documentos: [],
  archivos: [],
  usuario: '',
  created_at: null,

  // Campos computados (read-only) del modelo Preparacion
  documentos_completos: false,
  documentos_completados: 0,
  total_documentos: 0,
  total_archivos: 0,
  hace_dias: null,
  codigo_encargado: '',

  // Lista de trámites finalizados y control de UI
  tramites: [],
  history: [],
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
    proveedor: '',
    start_date: '',
    end_date: '',
  },
};

export const finalizadosStore = createSlice({
  name: 'finalizadosStore',
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

    handleDataHistoryStore: (state, action) => {
      state.history = action.payload.history;
    },

    // Limpia el formulario para un nuevo registro
    resetFormStore: (state) => {
      state.id = null;
      state.placa = '';
      state.departamento = '';
      state.municipio = '';
      state.tipo_vehiculo = '';
      state.estado = 'finalizado';
      state.estado_tracker = 'finalizado';
      state.estado_detalle = '';
      state.fecha_recepcion_municipio = '';
      state.proveedor = '';
      state.paquete = '';
      state.lista_documentos = [];
      state.archivos = [];
      state.history = [];
      state.usuario = '';
      state.created_at = null;
      state.documentos_completos = false;
      state.documentos_completados = 0;
      state.total_documentos = 0;
      state.total_archivos = 0;
      state.hace_dias = null;
      state.codigo_encargado = '';
    },

    // Carga un trámite para editar
    loadForEditStore: (state, action) => {
      const finalizado = action.payload;
      state.id = finalizado.id;
      state.placa = finalizado.placa;
      state.departamento = finalizado.departamento;
      state.municipio = finalizado.municipio;
      state.tipo_vehiculo = finalizado.tipo_vehiculo;
      state.estado = finalizado.estado;
      state.estado_tracker = finalizado.estado_tracker;
      state.estado_detalle = finalizado.estado_detalle || '';
      state.fecha_recepcion_municipio = finalizado.fecha_recepcion_municipio || '';
      state.proveedor = finalizado.proveedor_id || '';
      state.paquete = finalizado.paquete || '';
      state.lista_documentos = finalizado.lista_documentos || [];
      state.archivos = finalizado.archivos || [];
      state.usuario = finalizado.usuario || '';
      state.created_at = finalizado.created_at;
      state.documentos_completos = finalizado.documentos_completos || false;
      state.documentos_completados = finalizado.documentos_completados || 0;
      state.total_documentos = finalizado.total_documentos || 0;
      state.total_archivos = finalizado.total_archivos || 0;
      state.hace_dias = finalizado.hace_dias;
      state.codigo_encargado = finalizado.codigo_encargado || '';
    },

    // Agregar un trámite a la lista (para WebSocket en tiempo real)
    addTramiteStore: (state, action) => {
      state.tramites.unshift(action.payload);
      state.paginado_info.count += 1;
    },

    // Actualizar un trámite en la lista (para WebSocket en tiempo real)
    updateTramiteStore: (state, action) => {
      const updatedTramite = action.payload;
      const index = state.tramites.findIndex(t => t.id === updatedTramite.id);
      if (index !== -1) {
        state.tramites[index] = updatedTramite;
      }
    },

    // Eliminar un trámite de la lista (para WebSocket en tiempo real)
    removeTramiteStore: (state, action) => {
      const tramiteId = action.payload;
      state.tramites = state.tramites.filter(t => t.id !== tramiteId);
      state.paginado_info.count -= 1;
    },

    // Manejo de paginación
    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },

    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1;
    },

    // Manejo de filtros
    setFilterField: (state, action) => {
      const { field, value } = action.payload;
      if (field in state.filters) {
        state.filters[field] = value;
      }
    },

    clearFilters: (state) => {
      state.filters = {
        search: '',
        estado: '',
        departamento: '',
        municipio: '',
        tipo_vehiculo: '',
        proveedor: '',
        start_date: '',
        end_date: '',
      };
      state.paginado_info.current_page = 1;
    },

    // Manejo de estados de loading y errores
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  handleFormStore,
  handleDataStore,
  handleDataHistoryStore,
  resetFormStore,
  loadForEditStore,
  addTramiteStore,
  updateTramiteStore,
  removeTramiteStore,
  setPaginationPage,
  setPaginationPageSize,
  setFilterField,
  clearFilters,
  setLoading,
  setError,
} = finalizadosStore.actions;

export default finalizadosStore.reducer;
