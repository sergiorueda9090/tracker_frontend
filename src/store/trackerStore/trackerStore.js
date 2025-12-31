import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Datos del Formulario de Tracker (CRUD) - Ahora usa modelo Preparacion con estado_modulo=2
  id: null,
  placa: '',
  departamento: '',
  municipio: '',
  tipo_vehiculo: '',
  estado: 'en_radicacion', // en_radicacion, con_novedad, finalizado (minúsculas)
  estado_tracker: 'sin_tracker', // sin_tracker, en_radicacion, con_novedad, finalizado (minúsculas)
  estado_detalle: '',
  fecha_recepcion_municipio: '',
  proveedor: '',
  paquete: '', // Nuevo: heredado de Preparacion
  lista_documentos: [], // Nuevo: heredado de Preparacion
  archivos: [], // Nuevo: heredado de Preparacion
  usuario: '',
  created_at: null,

  // Campos computados (read-only) del modelo Preparacion
  documentos_completos: false,
  documentos_completados: 0,
  total_documentos: 0,
  total_archivos: 0,
  hace_dias: null,
  codigo_encargado: '',

  // Lista de trámites en tracker y control de UI
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

export const trackerStore = createSlice({
  name: 'trackerStore',
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
      state.estado = 'en_radicacion'; // Minúsculas
      state.estado_tracker = 'sin_tracker'; // Minúsculas
      state.estado_detalle = '';
      state.fecha_recepcion_municipio = '';
      state.proveedor = '';
      state.paquete = '';
      state.lista_documentos = [];
      state.archivos = [];
      state.history = [];
      state.usuario = '';
      state.created_at = null;
      // Reset computed fields
      state.documentos_completos = false;
      state.documentos_completados = 0;
      state.total_documentos = 0;
      state.total_archivos = 0;
      state.hace_dias = null;
      state.codigo_encargado = '';
    },

    // Carga un trámite existente en el formulario para edición
    loadForEditStore: (state, action) => {
      const tramite = action.payload;
      state.id = tramite.id;
      state.placa = tramite.placa || '';
      state.departamento = tramite.departamento || '';
      state.municipio = tramite.municipio || '';
      state.tipo_vehiculo = tramite.tipo_vehiculo || '';
      state.estado = tramite.estado || 'en_radicacion';
      state.estado_tracker = tramite.estado_tracker || 'sin_tracker';
      state.estado_detalle = tramite.estado_detalle || '';
      state.fecha_recepcion_municipio = tramite.fecha_recepcion_municipio || '';
      state.proveedor = tramite.proveedor || '';
      state.paquete = tramite.paquete || '';
      state.lista_documentos = tramite.lista_documentos || [];
      state.archivos = tramite.archivos || [];
      state.usuario = tramite.usuario || '';
      state.created_at = tramite.created_at || null;
      // Load computed fields
      state.documentos_completos = tramite.documentos_completos || false;
      state.documentos_completados = tramite.documentos_completados || 0;
      state.total_documentos = tramite.total_documentos || 0;
      state.total_archivos = tramite.total_archivos || 0;
      state.hace_dias = tramite.hace_dias;
      state.codigo_encargado = tramite.codigo_encargado || '';
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

    // ===== Acciones WebSocket en tiempo real =====

    // Agregar nuevo trámite recibido por WebSocket
    addTramiteRealtime: (state, action) => {
      const newTramite = action.payload;
      
      // ✅ VERIFICAR SI YA EXISTE ANTES DE AGREGAR
      const exists = state.tramites.some(t => t.id === newTramite.id);
      
      if (!exists) {
        // Agregar al inicio de la lista
        state.tramites = [newTramite, ...state.tramites];
        
        // Actualizar contador
        state.paginado_info.count = state.paginado_info.count + 1;
        state.paginado_info.total_pages = Math.ceil(
          state.paginado_info.count / state.paginado_info.page_size
        );

        // Si excede el tamaño de página, remover el último elemento
        if (state.tramites.length > state.paginado_info.page_size) {
          state.tramites.pop();
        }
      } else {
        // Si ya existe, actualizar en su lugar
        const index = state.tramites.findIndex(t => t.id === newTramite.id);
        if (index !== -1) {
          state.tramites[index] = newTramite;
        }
      }
    },

    // Actualizar trámite existente recibido por WebSocket
    updateTramiteRealtime: (state, action) => {
      const updatedTramite = action.payload;
      const index = state.tramites.findIndex(t => t.id === updatedTramite.id);
      if (index !== -1) {
        state.tramites[index] = updatedTramite;
      }
    },

    // Eliminar trámite recibido por WebSocket
    deleteTramiteRealtime: (state, action) => {
      const tramiteId = action.payload;
      state.tramites = state.tramites.filter(t => t.id !== tramiteId);
      // Actualizar contador
      state.paginado_info.count = Math.max(0, state.paginado_info.count - 1);
      state.paginado_info.total_pages = Math.ceil(state.paginado_info.count / state.paginado_info.page_size);
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
  handleDataHistoryStore,
  addTramiteRealtime,
  updateTramiteRealtime,
  deleteTramiteRealtime,
} = trackerStore.actions;

export default trackerStore.reducer;
