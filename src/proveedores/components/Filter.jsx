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
  Business, // Cambiado por contexto de proveedores
  LocationCity, // Para departamentos/municipios
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
// Ajustado a proveedoresStore
import { filterFieldThunk, applyFilters, handleClearFilters } from '../../store/proveedoresStore/proveedoresThunks';
import '../../styles/Filter.css';

const Filter = () => {
  const dispatch = useDispatch();
  // Ajustado a proveedoresStore
  const { filters } = useSelector(state => state.proveedoresStore);
  
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

  return (
    <Paper className="filter-paper">
      <Box className="filter-header">
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList color="inherit" />
          <span className="filter-title">Filtros de Proveedores</span>
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
              label="Buscar Proveedor"
              placeholder="Buscar por nombre, código de encargado, WhatsApp..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: 'primary.main', fontSize: 24 }} />
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
                  backgroundColor: 'rgba(0, 168, 89, 0.04)', // Color verde basado en tu diseño
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

          {/* Fecha inicio */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Registrado Desde"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
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
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Registrado Hasta"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: filters.startDate || undefined
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
                Filtrar Proveedores
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Filter;