import React from 'react';
import {
  Paper,
  Grid,
  TextField,
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
import { filterFieldThunk, applyFilters, handleClearFilters } from '../../store/finalizadosStore/finalizadosThunks';
import '../../styles/Filter.css';

const Filter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.finalizadosStore);

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
          <span className="filter-title">Filtros de Búsqueda</span>
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
              label="Buscar"
              placeholder="Buscar por placa, trámite o proveedor..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCar sx={{ color: 'primary.main', fontSize: 28 }} />
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
                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  }
                }
              }}
            />
          </Grid>

          {/* Filtros Secundarios */}
          <Grid item xs={12}>
            <Box className="secondary-filters-label">
              <FilterList fontSize="small" sx={{ mr: 0.5 }} />
              Filtros Adicionales
            </Box>
          </Grid>

          {/* Fecha inicio */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Fecha Desde"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
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
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Fecha Hasta"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
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
                color="primary"
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
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Filter;
