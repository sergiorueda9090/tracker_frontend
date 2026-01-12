import React, { useEffect } from 'react';
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
  Assignment,
  AccountCircle,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { filterFieldThunk, applyFilters, handleClearFilters } from '../../store/transitosTarifasStore/transitosTarifasThunks';
import { getAllThunks as getAllTramites } from "../../store/tramitesStore/tramitesThunks";
import { getAllThunks as getAllProveedores } from "../../store/proveedoresStore/proveedoresThunks";
import '../../styles/Filter.css';

const Filter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.transitosTarifasStore);
  const { tramites } = useSelector(state => state.tramitesStore);
  const { proveedores } = useSelector(state => state.proveedoresStore);

  useEffect(() => {
    // Cargar trámites y proveedores para los filtros
    dispatch(getAllTramites({ page_size: 100 }));
    dispatch(getAllProveedores({ page_size: 100 }));
  }, [dispatch]);

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
              placeholder="Buscar por trámite o proveedor..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'primary.main', fontSize: 28 }} />
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

          {/* Filtro por trámite */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Trámite"
              value={filters.tramite}
              onChange={(e) => handleChange('tramite', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Assignment fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Todos los trámites</em>
              </MenuItem>
              {Array.isArray(tramites) && tramites.filter(t => t.is_active).map((tramite) => (
                <MenuItem key={tramite.id} value={tramite.id}>
                  {tramite.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Filtro por proveedor */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Proveedor"
              value={filters.proveedor}
              onChange={(e) => handleChange('proveedor', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Todos los proveedores</em>
              </MenuItem>
              {Array.isArray(proveedores) && proveedores.filter(p => p.is_active).map((proveedor) => (
                <MenuItem key={proveedor.id} value={proveedor.id}>
                  {proveedor.codigo_encargado} - {proveedor.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Filtro por estado */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Estado"
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              InputProps={{
                startAdornment: filters.status !== '' && (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: filters.status === '1' ? 'success.main' : 'grey.400',
                        mr: 0.5
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="1">✅ Activos</MenuItem>
              <MenuItem value="0">🔒 Inactivos</MenuItem>
            </TextField>
          </Grid>

          {/* Fecha inicio */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Desde"
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
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Hasta"
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
