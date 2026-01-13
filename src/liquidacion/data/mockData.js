// Datos mock para trámites finalizados
// Estos datos simulan la respuesta del backend

export const mockTramites = [
  {
    id: 1,
    placa: 'ABC123',
    tipo_tramite: 'Traspaso',
    estado: 'Finalizado',
    fecha_finalizado: '2026-01-10T15:30:00Z',

    // Datos del trámite
    tramite_id: 1,
    tramite_nombre: 'Traspaso',
    tramite_precio: 350000,

    // Facturación
    servicio_empresa: 450000, // Lo que cobra la empresa al cliente
    iva_servicio: 0, // Se calcula automáticamente (19%)

    // Proveedor/Gestor
    proveedor_id: 1,
    proveedor_nombre: 'Juan Pérez',
    proveedor_codigo: 'GP001',
    servicio_proveedor: 250000, // Lo que se le paga al gestor

    // Ubicación
    departamento_id: 11,
    departamento_nombre: 'Bogotá D.C.',
    municipio_id: 11001,
    municipio_nombre: 'Bogotá',

    // Conceptos adicionales del gestor
    transporte: 50000,
    bonificacion: 30000,
    anticipos: 100000,

    // Metadata
    created_at: '2026-01-08T10:00:00Z',
    updated_at: '2026-01-10T15:30:00Z',
  },
  {
    id: 2,
    placa: 'XYZ789',
    tipo_tramite: 'Matrícula',
    estado: 'Finalizado',
    fecha_finalizado: '2026-01-11T09:15:00Z',

    tramite_id: 2,
    tramite_nombre: 'Matrícula',
    tramite_precio: 280000,

    servicio_empresa: 380000,
    iva_servicio: 0,

    proveedor_id: 2,
    proveedor_nombre: 'María González',
    proveedor_codigo: 'GP002',
    servicio_proveedor: 200000,

    departamento_id: 5,
    departamento_nombre: 'Antioquia',
    municipio_id: 5001,
    municipio_nombre: 'Medellín',

    transporte: 40000,
    bonificacion: 20000,
    anticipos: 80000,

    created_at: '2026-01-09T08:30:00Z',
    updated_at: '2026-01-11T09:15:00Z',
  },
  {
    id: 3,
    placa: 'DEF456',
    tipo_tramite: 'Duplicado',
    estado: 'Finalizado',
    fecha_finalizado: '2026-01-11T14:45:00Z',

    tramite_id: 3,
    tramite_nombre: 'Duplicado',
    tramite_precio: 150000,

    servicio_empresa: 220000,
    iva_servicio: 0,

    proveedor_id: 3,
    proveedor_nombre: 'Carlos Rodríguez',
    proveedor_codigo: 'GP003',
    servicio_proveedor: 120000,

    departamento_id: 76,
    departamento_nombre: 'Valle del Cauca',
    municipio_id: 76001,
    municipio_nombre: 'Cali',

    transporte: 30000,
    bonificacion: 15000,
    anticipos: 50000,

    created_at: '2026-01-10T11:20:00Z',
    updated_at: '2026-01-11T14:45:00Z',
  },
  {
    id: 4,
    placa: 'GHI321',
    tipo_tramite: 'Traspaso',
    estado: 'Finalizado',
    fecha_finalizado: '2026-01-12T10:00:00Z',

    tramite_id: 1,
    tramite_nombre: 'Traspaso',
    tramite_precio: 350000,

    servicio_empresa: 480000,
    iva_servicio: 0,

    proveedor_id: 1,
    proveedor_nombre: 'Juan Pérez',
    proveedor_codigo: 'GP001',
    servicio_proveedor: 270000,

    departamento_id: 8,
    departamento_nombre: 'Atlántico',
    municipio_id: 8001,
    municipio_nombre: 'Barranquilla',

    transporte: 60000,
    bonificacion: 25000,
    anticipos: 120000,

    created_at: '2026-01-11T08:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: 5,
    placa: 'JKL654',
    tipo_tramite: 'Cambio de Servicio',
    estado: 'Finalizado',
    fecha_finalizado: '2026-01-12T16:20:00Z',

    tramite_id: 4,
    tramite_nombre: 'Cambio de Servicio',
    tramite_precio: 200000,

    servicio_empresa: 290000,
    iva_servicio: 0,

    proveedor_id: 2,
    proveedor_nombre: 'María González',
    proveedor_codigo: 'GP002',
    servicio_proveedor: 180000,

    departamento_id: 13,
    departamento_nombre: 'Bolívar',
    municipio_id: 13001,
    municipio_nombre: 'Cartagena',

    transporte: 45000,
    bonificacion: 18000,
    anticipos: 70000,

    created_at: '2026-01-11T13:00:00Z',
    updated_at: '2026-01-12T16:20:00Z',
  },
];

// Función helper para calcular IVA (19%)
export const calcularIVA = (monto) => {
  return monto * 0.19;
};

// Función helper para calcular total de facturación
export const calcularTotalFacturacion = (tramite) => {
  const iva = calcularIVA(tramite.servicio_empresa);
  return tramite.tramite_precio + tramite.servicio_empresa + iva;
};

// Función helper para calcular total servicio gestor
export const calcularTotalServicioGestor = (tramite) => {
  return (
    tramite.servicio_proveedor +
    tramite.transporte +
    tramite.bonificacion -
    tramite.anticipos
  );
};

// Función helper para calcular utilidad
export const calcularUtilidad = (tramite) => {
  // Total facturación SIN IVA
  const totalFacturacionSinIVA = tramite.tramite_precio + tramite.servicio_empresa;
  const totalServicioGestor = calcularTotalServicioGestor(tramite);

  return totalFacturacionSinIVA - totalServicioGestor;
};

// Función para formatear moneda en pesos colombianos
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Función para formatear fecha
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
