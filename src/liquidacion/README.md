# Módulo de Liquidación

Este módulo muestra la visualización de la liquidación de trámites finalizados.

## Estructura del Módulo

```
liquidacion/
├── Main.jsx                        # Componente principal
├── index.js                        # Exportación del módulo
├── data/
│   └── mockData.js                 # Datos de prueba (mock)
└── components/
    ├── MainHeader.jsx              # Encabezado de la página
    ├── Filter.jsx                  # Filtros de búsqueda
    ├── MainTable.jsx               # Tabla de trámites finalizados
    ├── MainDialog.jsx              # Dialog con liquidación detallada
    └── Pagination.jsx              # Componente de paginación
```

## Características Implementadas

### 1. Datos Mock
- 5 trámites de prueba con datos completos
- Funciones helper para cálculos automáticos
- Formateo de moneda en pesos colombianos (COP)

### 2. Vista de Tabla (MainTable.jsx)
- Listado de trámites finalizados
- Información visible: ID, Placa, Trámite, Gestor, Municipio, Precios, Fecha
- Botón "Ver Liquidación" para abrir el detalle

### 3. Detalle de Liquidación (MainDialog.jsx)

El dialog muestra dos tarjetas principales:

#### 🧾 Tarjeta 1: Facturación
- (+) Precio del trámite
- (+) Servicio empresa
- (+) IVA Servicio empresa (19% automático)
- **Total Facturación** (con IVA)
- Subtotal sin IVA

#### 👤 Tarjeta 2: Servicio Gestor
- Información del gestor (nombre, código, municipio)
- (+) Servicio gestor
- (+) Transporte / Envíos
- (+) Bonificación
- (-) Anticipos
- **Total Servicio Gestor**

#### 📊 Cálculo de Utilidad
Debajo de ambas tarjetas se muestra:

```
Utilidad = Total Facturación (sin IVA) - Total Servicio Gestor
```

- Resaltado en verde si es positiva
- Resaltado en rojo si es negativa
- Muestra visualmente la operación completa

## Cálculos Automáticos

Todos los cálculos se realizan automáticamente en `data/mockData.js`:

### IVA (19%)
```javascript
calcularIVA(monto) = monto * 0.19
```

### Total Facturación
```javascript
Total = tramite_precio + servicio_empresa + IVA
```

### Total Servicio Gestor
```javascript
Total = servicio_proveedor + transporte + bonificación - anticipos
```

### Utilidad
```javascript
Utilidad = (tramite_precio + servicio_empresa) - Total Servicio Gestor
```

## Componentes Adicionales

### Filter.jsx
- Búsqueda por placa, trámite o proveedor
- Filtro por rango de fechas
- Contador de filtros activos
- Botones: Buscar y Limpiar

### Pagination.jsx
- Navegación entre páginas
- Selector de registros por página (5, 10, 25, 50, 100)
- Indicador de registros mostrados

## Uso del Módulo

### Acceder al módulo
El módulo se importa en las rutas de la aplicación:

```javascript
import Liquidacion from './liquidacion';
```

### Ver liquidación de un trámite
1. En la tabla, haz clic en el ícono del ojo (👁️)
2. Se abrirá el dialog con el detalle completo
3. Puedes imprimir o cerrar el dialog

## Datos Mock

Los datos de prueba están en `data/mockData.js` y contienen:

- 5 trámites de diferentes tipos (Traspaso, Matrícula, Duplicado, Cambio de Servicio)
- Gestores variados
- Diferentes municipios de Colombia
- Valores económicos realistas

### Estructura de un trámite mock:
```javascript
{
  id: 1,
  placa: 'ABC123',
  tipo_tramite: 'Traspaso',
  estado: 'Finalizado',

  // Precios
  tramite_precio: 350000,
  servicio_empresa: 450000,
  servicio_proveedor: 250000,

  // Gestor
  proveedor_nombre: 'Juan Pérez',
  proveedor_codigo: 'GP001',

  // Ubicación
  municipio_nombre: 'Bogotá',
  departamento_nombre: 'Bogotá D.C.',

  // Conceptos adicionales
  transporte: 50000,
  bonificacion: 30000,
  anticipos: 100000,

  // Fechas
  fecha_finalizado: '2026-01-10T15:30:00Z',
}
```

## Transición a Backend Real

Cuando se conecte al backend real, solo necesitas:

1. **Reemplazar mockTramites** en `MainTable.jsx` por datos del store de Redux
2. **Conectar Filter.jsx** a los thunks de filtrado
3. **Conectar Pagination.jsx** al store de paginación
4. **Mantener las funciones de cálculo** en `mockData.js` ya que son independientes

### Ejemplo de transición:
```javascript
// Antes (mock):
import { mockTramites } from '../data/mockData';

// Después (real):
import { useSelector } from 'react-redux';
const { finalizados } = useSelector(state => state.finalizadosStore);
```

## Notas Importantes

- ✅ Todos los cálculos son automáticos
- ✅ El IVA se calcula al 19%
- ✅ Los datos están listos para ser reemplazados por datos reales
- ✅ El diseño es responsive y profesional
- ✅ No se rompió ninguna funcionalidad existente
- ✅ No se agregaron dependencias innecesarias

## Testing

Para probar el módulo:
1. Navega a la ruta `/liquidacion` en la aplicación
2. Verás 5 trámites de prueba en la tabla
3. Haz clic en "Ver Liquidación" para ver el detalle
4. Verifica que todos los cálculos sean correctos
5. Prueba los filtros y la paginación
