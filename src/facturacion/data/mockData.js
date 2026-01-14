// Datos mock para Facturación
// Simula información proveniente del módulo de Liquidación + datos del cliente

export const mockFacturasData = [
  {
    // ID de la factura (generado)
    factura_id: 'FAC-2026-001',
    numero_factura: null, // Se asigna cuando se envía a Siigo
    estado: 'pendiente', // pendiente, enviada, pagada, anulada
    fecha_creacion: '2026-01-10T15:30:00Z',
    fecha_vencimiento: '2026-01-25T23:59:59Z',

    // Datos del cliente
    cliente: {
      id: 1,
      tipo_documento: 'CC', // CC, NIT, CE, etc.
      numero_documento: '1234567890',
      nombre: 'Juan Carlos Martínez López',
      razon_social: null, // Para personas jurídicas
      email: 'juan.martinez@email.com',
      telefono: '+57 310 123 4567',
      direccion: 'Calle 100 # 20-30, Apto 502',
      municipio: 'Bogotá',
      departamento: 'Bogotá D.C.',
      codigo_postal: '110111',
    },

    // Datos del trámite (desde Liquidación)
    tramite: {
      id: 1,
      placa: 'ABC123',
      tipo_tramite: 'Traspaso',
      numero_tramite: 'TRA-2026-0123',
      fecha_finalizado: '2026-01-10T15:30:00Z',
      estado: 'Finalizado',

      // Gestor/Proveedor
      proveedor_nombre: 'Juan Pérez',
      proveedor_codigo: 'GP001',
      municipio_tramite: 'Bogotá',
      departamento_tramite: 'Bogotá D.C.',
    },

    // Valores económicos (desde Liquidación)
    valores: {
      // Precio del trámite
      tramite_precio: 350000,
      tramite_descripcion: 'Trámite de Traspaso de Vehículo',

      // Servicio empresa
      servicio_empresa: 450000,
      servicio_empresa_descripcion: 'Servicio de Gestión Administrativa',

      // IVA (calculado automáticamente al 19%)
      iva_porcentaje: 19,
      iva_monto: 0, // Se calcula automáticamente

      // Totales
      subtotal: 0, // tramite_precio + servicio_empresa
      total: 0, // subtotal + iva_monto
    },

    // Notas adicionales
    notas: 'Factura generada automáticamente desde el sistema de liquidación. Placa: ABC123',
    metodo_pago: 'Transferencia Bancaria',
  },
  {
    factura_id: 'FAC-2026-002',
    numero_factura: null,
    estado: 'pendiente',
    fecha_creacion: '2026-01-11T09:15:00Z',
    fecha_vencimiento: '2026-01-26T23:59:59Z',

    cliente: {
      id: 2,
      tipo_documento: 'NIT',
      numero_documento: '900123456-7',
      nombre: null,
      razon_social: 'TRANSPORTES DEL SUR S.A.S.',
      email: 'facturacion@transportesdelsur.com',
      telefono: '+57 320 456 7890',
      direccion: 'Carrera 50 # 15-40, Bodega 3',
      municipio: 'Medellín',
      departamento: 'Antioquia',
      codigo_postal: '050012',
    },

    tramite: {
      id: 2,
      placa: 'XYZ789',
      tipo_tramite: 'Matrícula',
      numero_tramite: 'TRA-2026-0124',
      fecha_finalizado: '2026-01-11T09:15:00Z',
      estado: 'Finalizado',

      proveedor_nombre: 'María González',
      proveedor_codigo: 'GP002',
      municipio_tramite: 'Medellín',
      departamento_tramite: 'Antioquia',
    },

    valores: {
      tramite_precio: 280000,
      tramite_descripcion: 'Trámite de Matrícula de Vehículo',
      servicio_empresa: 380000,
      servicio_empresa_descripcion: 'Servicio de Gestión Administrativa',
      iva_porcentaje: 19,
      iva_monto: 0,
      subtotal: 0,
      total: 0,
    },

    notas: 'Factura generada automáticamente desde el sistema de liquidación. Placa: XYZ789',
    metodo_pago: 'Efectivo',
  },
  {
    factura_id: 'FAC-2026-003',
    numero_factura: null,
    estado: 'pendiente',
    fecha_creacion: '2026-01-11T14:45:00Z',
    fecha_vencimiento: '2026-01-26T23:59:59Z',

    cliente: {
      id: 3,
      tipo_documento: 'CC',
      numero_documento: '9876543210',
      nombre: 'Ana María Rodríguez Sánchez',
      razon_social: null,
      email: 'ana.rodriguez@email.com',
      telefono: '+57 315 789 0123',
      direccion: 'Avenida 6 # 30-15',
      municipio: 'Cali',
      departamento: 'Valle del Cauca',
      codigo_postal: '760001',
    },

    tramite: {
      id: 3,
      placa: 'DEF456',
      tipo_tramite: 'Duplicado',
      numero_tramite: 'TRA-2026-0125',
      fecha_finalizado: '2026-01-11T14:45:00Z',
      estado: 'Finalizado',

      proveedor_nombre: 'Carlos Rodríguez',
      proveedor_codigo: 'GP003',
      municipio_tramite: 'Cali',
      departamento_tramite: 'Valle del Cauca',
    },

    valores: {
      tramite_precio: 150000,
      tramite_descripcion: 'Trámite de Duplicado de Tarjeta de Propiedad',
      servicio_empresa: 220000,
      servicio_empresa_descripcion: 'Servicio de Gestión Administrativa',
      iva_porcentaje: 19,
      iva_monto: 0,
      subtotal: 0,
      total: 0,
    },

    notas: 'Factura generada automáticamente desde el sistema de liquidación. Placa: DEF456',
    metodo_pago: 'Tarjeta de Crédito',
  },
  {
    factura_id: 'FAC-2026-004',
    numero_factura: 'SIIGO-00123', // Ya enviada a Siigo
    estado: 'enviada',
    fecha_creacion: '2026-01-12T10:00:00Z',
    fecha_vencimiento: '2026-01-27T23:59:59Z',

    cliente: {
      id: 4,
      tipo_documento: 'CC',
      numero_documento: '5551234567',
      nombre: 'Pedro Antonio Gómez Castro',
      razon_social: null,
      email: 'pedro.gomez@email.com',
      telefono: '+57 318 234 5678',
      direccion: 'Carrera 10 # 5-20',
      municipio: 'Barranquilla',
      departamento: 'Atlántico',
      codigo_postal: '080001',
    },

    tramite: {
      id: 4,
      placa: 'GHI321',
      tipo_tramite: 'Traspaso',
      numero_tramite: 'TRA-2026-0126',
      fecha_finalizado: '2026-01-12T10:00:00Z',
      estado: 'Finalizado',

      proveedor_nombre: 'Juan Pérez',
      proveedor_codigo: 'GP001',
      municipio_tramite: 'Barranquilla',
      departamento_tramite: 'Atlántico',
    },

    valores: {
      tramite_precio: 350000,
      tramite_descripcion: 'Trámite de Traspaso de Vehículo',
      servicio_empresa: 480000,
      servicio_empresa_descripcion: 'Servicio de Gestión Administrativa',
      iva_porcentaje: 19,
      iva_monto: 0,
      subtotal: 0,
      total: 0,
    },

    notas: 'Factura generada automáticamente desde el sistema de liquidación. Placa: GHI321',
    metodo_pago: 'Transferencia Bancaria',
  },
  {
    factura_id: 'FAC-2026-005',
    numero_factura: null,
    estado: 'pendiente',
    fecha_creacion: '2026-01-12T16:20:00Z',
    fecha_vencimiento: '2026-01-27T23:59:59Z',

    cliente: {
      id: 5,
      tipo_documento: 'NIT',
      numero_documento: '890456123-2',
      nombre: null,
      razon_social: 'SERVICIOS LOGÍSTICOS DEL CARIBE LTDA',
      email: 'contabilidad@servicioslogisticos.com',
      telefono: '+57 305 678 9012',
      direccion: 'Calle 25 # 18-50, Oficina 201',
      municipio: 'Cartagena',
      departamento: 'Bolívar',
      codigo_postal: '130001',
    },

    tramite: {
      id: 5,
      placa: 'JKL654',
      tipo_tramite: 'Cambio de Servicio',
      numero_tramite: 'TRA-2026-0127',
      fecha_finalizado: '2026-01-12T16:20:00Z',
      estado: 'Finalizado',

      proveedor_nombre: 'María González',
      proveedor_codigo: 'GP002',
      municipio_tramite: 'Cartagena',
      departamento_tramite: 'Bolívar',
    },

    valores: {
      tramite_precio: 200000,
      tramite_descripcion: 'Trámite de Cambio de Servicio del Vehículo',
      servicio_empresa: 290000,
      servicio_empresa_descripcion: 'Servicio de Gestión Administrativa',
      iva_porcentaje: 19,
      iva_monto: 0,
      subtotal: 0,
      total: 0,
    },

    notas: 'Factura generada automáticamente desde el sistema de liquidación. Placa: JKL654',
    metodo_pago: 'Transferencia Bancaria',
  },
];

// ===== FUNCIONES HELPER =====

// Calcular IVA (19% sobre servicio empresa)
export const calcularIVA = (servicioEmpresa, porcentaje = 19) => {
  return servicioEmpresa * (porcentaje / 100);
};

// Calcular subtotal (sin IVA)
export const calcularSubtotal = (tramitePrecio, servicioEmpresa) => {
  return tramitePrecio + servicioEmpresa;
};

// Calcular total (con IVA)
export const calcularTotal = (tramitePrecio, servicioEmpresa, ivaMonto) => {
  return tramitePrecio + servicioEmpresa + ivaMonto;
};

// Procesar factura con cálculos automáticos
export const procesarFactura = (factura) => {
  const iva = calcularIVA(factura.valores.servicio_empresa, factura.valores.iva_porcentaje);
  const subtotal = calcularSubtotal(factura.valores.tramite_precio, factura.valores.servicio_empresa);
  const total = calcularTotal(factura.valores.tramite_precio, factura.valores.servicio_empresa, iva);

  return {
    ...factura,
    valores: {
      ...factura.valores,
      iva_monto: iva,
      subtotal: subtotal,
      total: total,
    },
  };
};

// Obtener todas las facturas procesadas
export const obtenerFacturasProcesadas = () => {
  return mockFacturasData.map(procesarFactura);
};

// Formatear moneda en pesos colombianos
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formatear fecha
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Formatear fecha con hora
export const formatDateTime = (dateString) => {
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

// Obtener color según estado de factura
export const getEstadoColor = (estado) => {
  const colores = {
    pendiente: 'warning',
    enviada: 'info',
    pagada: 'success',
    anulada: 'error',
  };
  return colores[estado] || 'default';
};

// Obtener label según estado de factura
export const getEstadoLabel = (estado) => {
  const labels = {
    pendiente: 'Pendiente',
    enviada: 'Enviada a Siigo',
    pagada: 'Pagada',
    anulada: 'Anulada',
  };
  return labels[estado] || estado;
};
