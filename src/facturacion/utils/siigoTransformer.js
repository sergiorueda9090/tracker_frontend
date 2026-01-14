/**
 * Transformador de datos para integración con Siigo
 *
 * Este módulo contiene las funciones para transformar los datos internos
 * de la aplicación al formato requerido por la API de Siigo.
 *
 * Documentación de Siigo API:
 * https://siigoapi.docs.apiary.io/
 */

/**
 * Transforma los datos del cliente al formato Siigo
 * @param {Object} cliente - Datos del cliente desde la aplicación
 * @returns {Object} - Cliente en formato Siigo
 */
export const transformarClienteSiigo = (cliente) => {
  return {
    // Identificación
    identification: cliente.numero_documento,
    branch_office: 0, // Sucursal principal

    // Información personal/empresarial
    person_type: cliente.razon_social ? 'Company' : 'Person',
    id_type: {
      code: mapTipoDocumento(cliente.tipo_documento),
    },

    // Nombre
    name: [
      cliente.razon_social || cliente.nombre,
    ],

    // Información de contacto
    address: {
      address: cliente.direccion,
      city: {
        country_code: 'Co', // Colombia
        state_code: mapDepartamento(cliente.departamento),
        city_code: mapMunicipio(cliente.municipio),
      },
      postal_code: cliente.codigo_postal || '',
    },

    phones: [
      {
        indicative: '57', // Colombia
        number: cliente.telefono.replace(/\D/g, ''), // Solo números
        extension: '',
      },
    ],

    contacts: [
      {
        first_name: cliente.nombre || cliente.razon_social,
        email: cliente.email,
      },
    ],
  };
};

/**
 * Transforma una factura completa al formato Siigo
 * @param {Object} factura - Factura procesada con todos los cálculos
 * @returns {Object} - Factura en formato Siigo
 */
export const transformarFacturaSiigo = (factura) => {
  const { cliente, tramite, valores, fecha_creacion, fecha_vencimiento, notas } = factura;

  return {
    // Información del documento
    document: {
      id: 24601, // ID del tipo de documento en Siigo (Factura de Venta)
    },

    // Fecha
    date: formatDateSiigo(fecha_creacion),

    // Cliente
    customer: {
      identification: cliente.numero_documento,
      branch_office: 0,
    },

    // Vendedor (opcional, puede configurarse en Siigo)
    seller: null,

    // Observaciones
    observations: notas || `Factura por trámite ${tramite.tipo_tramite} - Placa ${tramite.placa}`,

    // Items/Productos de la factura
    items: generarItemsSiigo(valores, tramite),

    // Pagos (opcional)
    payments: [],

    // Retenciones (si aplica)
    retentions: [],

    // Información adicional
    cost_center: null, // Centro de costos (si aplica)

    // Fecha de vencimiento
    due_date: formatDateSiigo(fecha_vencimiento),
  };
};

/**
 * Genera los items/productos de la factura para Siigo
 * @param {Object} valores - Valores económicos de la factura
 * @param {Object} tramite - Información del trámite
 * @returns {Array} - Array de items en formato Siigo
 */
const generarItemsSiigo = (valores, tramite) => {
  const items = [];

  // Item 1: Trámite
  items.push({
    code: `TRA-${tramite.tipo_tramite.toUpperCase()}`, // Código del producto en Siigo
    description: valores.tramite_descripcion || `Trámite de ${tramite.tipo_tramite}`,
    quantity: 1,
    price: valores.tramite_precio,
    discount: 0,
    taxes: [
      {
        id: 13156, // ID del IVA 0% en Siigo (trámites generalmente no tienen IVA)
        percentage: 0,
      },
    ],
  });

  // Item 2: Servicio Empresa
  items.push({
    code: 'SRV-GESTION', // Código del producto en Siigo
    description: valores.servicio_empresa_descripcion || 'Servicio de Gestión Administrativa',
    quantity: 1,
    price: valores.servicio_empresa,
    discount: 0,
    taxes: [
      {
        id: 13156, // ID del IVA 19% en Siigo
        percentage: valores.iva_porcentaje,
      },
    ],
  });

  return items;
};

/**
 * Mapea el tipo de documento interno al código Siigo
 * @param {string} tipoDocumento - Tipo de documento interno (CC, NIT, etc.)
 * @returns {string} - Código de tipo de documento en Siigo
 */
const mapTipoDocumento = (tipoDocumento) => {
  const mapeo = {
    'CC': '13', // Cédula de Ciudadanía
    'NIT': '31', // NIT
    'CE': '22', // Cédula de Extranjería
    'TI': '12', // Tarjeta de Identidad
    'PAS': '41', // Pasaporte
    'DIE': '21', // DIE
  };
  return mapeo[tipoDocumento] || '13'; // Por defecto CC
};

/**
 * Mapea el departamento al código DANE
 * @param {string} departamento - Nombre del departamento
 * @returns {string} - Código DANE del departamento
 */
const mapDepartamento = (departamento) => {
  const mapeo = {
    'Bogotá D.C.': '11',
    'Antioquia': '05',
    'Valle del Cauca': '76',
    'Atlántico': '08',
    'Bolívar': '13',
    'Santander': '68',
    'Cundinamarca': '25',
    // Agregar más según necesidad
  };
  return mapeo[departamento] || '11';
};

/**
 * Mapea el municipio al código DANE
 * @param {string} municipio - Nombre del municipio
 * @returns {string} - Código DANE del municipio
 */
const mapMunicipio = (municipio) => {
  const mapeo = {
    'Bogotá': '11001',
    'Medellín': '05001',
    'Cali': '76001',
    'Barranquilla': '08001',
    'Cartagena': '13001',
    'Bucaramanga': '68001',
    // Agregar más según necesidad
  };
  return mapeo[municipio] || '11001';
};

/**
 * Formatea una fecha al formato requerido por Siigo (YYYY-MM-DD)
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
const formatDateSiigo = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Valida que los datos estén completos para enviar a Siigo
 * @param {Object} factura - Factura a validar
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validarFacturaSiigo = (factura) => {
  const errors = [];

  // Validar cliente
  if (!factura.cliente) {
    errors.push('Falta información del cliente');
  } else {
    if (!factura.cliente.numero_documento) {
      errors.push('Falta número de documento del cliente');
    }
    if (!factura.cliente.email) {
      errors.push('Falta email del cliente');
    }
    if (!factura.cliente.direccion) {
      errors.push('Falta dirección del cliente');
    }
  }

  // Validar trámite
  if (!factura.tramite) {
    errors.push('Falta información del trámite');
  }

  // Validar valores
  if (!factura.valores) {
    errors.push('Falta información de valores');
  } else {
    if (!factura.valores.tramite_precio || factura.valores.tramite_precio <= 0) {
      errors.push('El precio del trámite debe ser mayor a 0');
    }
    if (!factura.valores.servicio_empresa || factura.valores.servicio_empresa <= 0) {
      errors.push('El servicio empresa debe ser mayor a 0');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Simula el envío de una factura a Siigo
 * (En producción, esto haría una llamada HTTP a la API de Siigo)
 * @param {Object} factura - Factura procesada
 * @returns {Promise} - Promesa con la respuesta simulada
 */
export const enviarFacturaSiigo = async (factura) => {
  // Validar datos
  const validacion = validarFacturaSiigo(factura);
  if (!validacion.valid) {
    throw new Error(`Errores de validación: ${validacion.errors.join(', ')}`);
  }

  // Transformar a formato Siigo
  const facturaFormatoSiigo = transformarFacturaSiigo(factura);

  // TODO: En producción, hacer la llamada real a la API de Siigo
  // const response = await axios.post('https://api.siigo.com/v1/invoices', facturaFormatoSiigo, {
  //   headers: {
  //     'Authorization': `Bearer ${ACCESS_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   }
  // });

  // Simular respuesta exitosa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        numero_factura: `SIIGO-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        message: 'Factura enviada exitosamente a Siigo',
        data: facturaFormatoSiigo,
      });
    }, 1500); // Simular delay de red
  });
};

/**
 * Obtiene el resumen de una factura para Siigo
 * @param {Object} factura - Factura procesada
 * @returns {Object} - Resumen de la factura
 */
export const obtenerResumenFactura = (factura) => {
  return {
    cliente: factura.cliente.razon_social || factura.cliente.nombre,
    documento: factura.cliente.numero_documento,
    tramite: factura.tramite.tipo_tramite,
    placa: factura.tramite.placa,
    subtotal: factura.valores.subtotal,
    iva: factura.valores.iva_monto,
    total: factura.valores.total,
  };
};
