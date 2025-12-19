import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  CalendarToday,
  DirectionsCar,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { filterFieldThunk, applyFilters, handleClearFilters } from '../../store/preparacionStore/preparacionThunks';
import '../../styles/Filter.css';

const Filter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.preparacionStore);

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  const handleChange = (field, value) => {
    dispatch(filterFieldThunk({ field, value }));
  };

  const handleApplyFilters = () => {
    dispatch(applyFilters(filters));
  };

  const handleClear = () => {
    dispatch(handleClearFilters());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  // Estados disponibles
  const estadosDisponibles = [
    { value: '', label: 'Todos los estados' },
    { value: 'en_verificacion', label: 'En Verificación' },
    { value: 'para_radicacion', label: 'Para Radicación' },
    { value: 'en_novedad', label: 'En Novedad' },
    { value: 'enviado_tracker', label: 'Enviado a Tracker' },
  ];

  // Tipos de vehículo
  const tiposVehiculo = [
    { value: '', label: 'Todos los tipos' },
    { value: 'Automóvil', label: 'Automóvil' },
    { value: 'Motocicleta', label: 'Motocicleta' },
    { value: 'Camioneta', label: 'Camioneta' },
    { value: 'Camión', label: 'Camión' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Taxi', label: 'Taxi' },
    { value: 'Otro', label: 'Otro' },
  ];

  return (
    <Paper className="filter-paper">
      <Box className="filter-header">
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList color="inherit" />
          <span className="filter-title">Filtros de Trámites en Preparación</span>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>

      <Box className="filter-content">
        <Grid container spacing={2.5}>
          {/* Búsqueda Principal */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Buscar Trámite"
              placeholder="Buscar por placa, ID, usuario..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'primary.main', fontSize: 24 }} />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleChange('search', '')}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 168, 89, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 168, 89, 0.08)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  }
                }
              }}
            />
          </Grid>

          {/* Estado */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label="Estado"
              value={filters.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            >
              {estadosDisponibles.map((estado) => (
                <MenuItem key={estado.value} value={estado.value}>
                  {estado.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Tipo de Vehículo */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label="Tipo de Vehículo"
              value={filters.tipo_vehiculo}
              onChange={(e) => handleChange('tipo_vehiculo', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCar fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            >
              {tiposVehiculo.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Fecha inicio */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Registrado Desde"
              value={filters.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Fecha fin */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Registrado Hasta"
              value={filters.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: filters.start_date || undefined
              }}
            />
          </Grid>

          {/* Botones de acción */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleClear}
                startIcon={<Clear />}
                disabled={activeFiltersCount === 0}
                sx={{ minWidth: 150 }}
              >
                Limpiar Filtros
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={handleApplyFilters}
                startIcon={<Search />}
                sx={{
                  minWidth: 150,
                  background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
                  }
                }}
              >
                Filtrar Trámites
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Filter;
