import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Datos del Formulario de Liquidacion (CRUD)
  id: null,
  preparacion_id: null,
  placa: '',
  tipo_vehiculo: '',

  // Trámite
  tramite_id: null,
  tramite_nombre: '',

  // Proveedor/Gestor
  proveedor_id: null,
  proveedor_nombre: '',
  proveedor_codigo: '',

  // Cliente
  cliente_id: null,
  cliente_nombre: '',

  // Ubicación
  departamento_id: null,
  departamento_nombre: '',
  municipio_id: null,
  municipio_nombre: '',

  // Datos económicos - Facturación
  derechos_tramite: '0.00',
  servicio_empresa: '0.00',
  iva_servicio: '0.00',
  total_facturacion: '0.00',
  total_facturacion_sin_iva: '0.00',

  // Datos económicos - Servicio Gestor
  servicio_gestor: '0.00',
  transporte: '0.00',
  bonificacion: '0.00',
  anticipos: '0.00',
  total_servicio_gestor: '0.00',

  // Utilidad
  utilidad: '0.00',
  es_rentable: false,

  // Estado y observaciones
  estado: 'pendiente',
  observaciones: '',
  fecha_finalizado: null,
  created_at: null,
  updated_at: null,

  // Lista de liquidaciones y control de UI
  liquidaciones: [],
  isLoading: false,
  error: null,

  // Estadísticas
  estadisticas: {
    total_liquidaciones: 0,
    total_facturacion: '0.00',
    total_servicio_gestor: '0.00',
    total_utilidad: '0.00',
    tramites_rentables: 0,
    tramites_no_rentables: 0,
    porcentaje_rentabilidad: 0,
    por_estado: {},
  },

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
    tramite: '',
    departamento: '',
    municipio: '',
    proveedor: '',
    start_date: '',
    end_date: '',
  },
};

export const liquidacionStore = createSlice({
  name: 'liquidacionStore',
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
      state.liquidaciones = action.payload.liquidaciones;
      state.paginado_info = {
        ...state.paginado_info,
        ...action.payload.paginado_info
      };
    },

    // Carga estadísticas
    setEstadisticas: (state, action) => {
      state.estadisticas = action.payload;
    },

    // Limpia el formulario para un nuevo registro
    resetFormStore: (state) => {
      state.id = null;
      state.preparacion_id = null;
      state.placa = '';
      state.tipo_vehiculo = '';
      state.tramite_id = null;
      state.tramite_nombre = '';
      state.proveedor_id = null;
      state.proveedor_nombre = '';
      state.proveedor_codigo = '';
      state.cliente_id = null;
      state.cliente_nombre = '';
      state.departamento_id = null;
      state.departamento_nombre = '';
      state.municipio_id = null;
      state.municipio_nombre = '';
      state.derechos_tramite = '0.00';
      state.servicio_empresa = '0.00';
      state.iva_servicio = '0.00';
      state.total_facturacion = '0.00';
      state.total_facturacion_sin_iva = '0.00';
      state.servicio_gestor = '0.00';
      state.transporte = '0.00';
      state.bonificacion = '0.00';
      state.anticipos = '0.00';
      state.total_servicio_gestor = '0.00';
      state.utilidad = '0.00';
      state.es_rentable = false;
      state.estado = 'pendiente';
      state.observaciones = '';
      state.fecha_finalizado = null;
      state.created_at = null;
      state.updated_at = null;
    },

    // Carga una liquidación para editar
    loadForEditStore: (state, action) => {
      const liq = action.payload;
      state.id = liq.id;
      state.preparacion_id = liq.preparacion_id;
      state.placa = liq.placa;
      state.tipo_vehiculo = liq.tipo_vehiculo;
      state.tramite_id = liq.tramite_id;
      state.tramite_nombre = liq.tramite_nombre || '';
      state.proveedor_id = liq.proveedor_id;
      state.proveedor_nombre = liq.proveedor_nombre || '';
      state.proveedor_codigo = liq.proveedor_codigo || '';
      state.cliente_id = liq.cliente_id;
      state.cliente_nombre = liq.cliente_nombre || '';
      state.departamento_id = liq.departamento_id;
      state.departamento_nombre = liq.departamento_nombre || '';
      state.municipio_id = liq.municipio_id;
      state.municipio_nombre = liq.municipio_nombre || '';
      state.derechos_tramite = liq.derechos_tramite || '0.00';
      state.servicio_empresa = liq.servicio_empresa || '0.00';
      state.iva_servicio = liq.iva_servicio || '0.00';
      state.total_facturacion = liq.total_facturacion || '0.00';
      state.total_facturacion_sin_iva = liq.total_facturacion_sin_iva || '0.00';
      state.servicio_gestor = liq.servicio_gestor || '0.00';
      state.transporte = liq.transporte || '0.00';
      state.bonificacion = liq.bonificacion || '0.00';
      state.anticipos = liq.anticipos || '0.00';
      state.total_servicio_gestor = liq.total_servicio_gestor || '0.00';
      state.utilidad = liq.utilidad || '0.00';
      state.es_rentable = liq.es_rentable || false;
      state.estado = liq.estado || 'pendiente';
      state.observaciones = liq.observaciones || '';
      state.fecha_finalizado = liq.fecha_finalizado;
      state.created_at = liq.created_at;
      state.updated_at = liq.updated_at;
    },

    // Agregar una liquidación a la lista (para WebSocket en tiempo real)
    addLiquidacionStore: (state, action) => {
      state.liquidaciones.unshift(action.payload);
      state.paginado_info.count += 1;
    },

    // Actualizar una liquidación en la lista (para WebSocket en tiempo real)
    updateLiquidacionStore: (state, action) => {
      const updatedLiq = action.payload;
      const index = state.liquidaciones.findIndex(l => l.id === updatedLiq.id);
      if (index !== -1) {
        state.liquidaciones[index] = updatedLiq;
      }
    },

    // Eliminar una liquidación de la lista (para WebSocket en tiempo real)
    removeLiquidacionStore: (state, action) => {
      const liqId = action.payload;
      state.liquidaciones = state.liquidaciones.filter(l => l.id !== liqId);
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
        tramite: '',
        departamento: '',
        municipio: '',
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
  setEstadisticas,
  resetFormStore,
  loadForEditStore,
  addLiquidacionStore,
  updateLiquidacionStore,
  removeLiquidacionStore,
  setPaginationPage,
  setPaginationPageSize,
  setFilterField,
  clearFilters,
  setLoading,
  setError,
} = liquidacionStore.actions;

export default liquidacionStore.reducer;
