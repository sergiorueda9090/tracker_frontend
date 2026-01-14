import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { Assignment, AccountCircle, AttachMoney, SwapHoriz } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from "../../store/transitosTarifasStore/transitosTarifasThunks";
import { showAlert } from "../../store/globalStore/globalStore";
import { getAllThunks as getAllTramites } from "../../store/tramitesStore/tramitesThunks";
import { getAllThunks as getAllProveedores } from "../../store/proveedoresStore/proveedoresThunks";

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    id,
    tramite_id,
    proveedor_id,
    servicio_proveedor,
    servicio_empresa
  } = useSelector(state => state.transitosTarifasStore);

  const { tramites } = useSelector(state => state.tramitesStore);
  const { providers } = useSelector(state => state.proveedoresStore);
  console.log(" === providers === ", providers);
  useEffect(() => {
    if (open) {
      // Cargar trámites y proveedores al abrir el modal
      dispatch(getAllTramites({ page_size: 100 }));
      dispatch(getAllProveedores({ page_size: 100 }));
    }
  }, [open, dispatch]);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const handleSave = () => {
    // Validaciones básicas
    if (!tramite_id) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "Debe seleccionar un trámite.",
      }));
      return;
    }

    if (!proveedor_id) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "Debe seleccionar un proveedor.",
      }));
      return;
    }

    if (!servicio_proveedor || parseFloat(servicio_proveedor) <= 0) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El servicio del proveedor debe ser mayor a cero.",
      }));
      return;
    }

    if (!servicio_empresa || parseFloat(servicio_empresa) <= 0) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El servicio de la empresa debe ser mayor a cero.",
      }));
      return;
    }

    // Validar que los precios sean números válidos
    if (isNaN(parseFloat(servicio_proveedor)) || isNaN(parseFloat(servicio_empresa))) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Valor Inválido",
        text: "Los precios deben ser números válidos.",
      }));
      return;
    }

    // Preparar datos
    const data = {
      tramite_id: parseInt(tramite_id),
      proveedor_id: parseInt(proveedor_id),
      servicio_proveedor: parseFloat(servicio_proveedor),
      servicio_empresa: parseFloat(servicio_empresa)
    };

    // Llamar al thunk correspondiente
    if (id) {
      dispatch(updateThunks(id, data));
    } else {
      dispatch(createThunks(data));
    }
  };

  // Calcular margen de ganancia
  const calcularMargen = () => {
    const prov = parseFloat(servicio_proveedor) || 0;
    const emp = parseFloat(servicio_empresa) || 0;
    return emp - prov;
  };

  const calcularPorcentajeMargen = () => {
    const prov = parseFloat(servicio_proveedor) || 0;
    const margen = calcularMargen();
    if (prov > 0) {
      return ((margen / prov) * 100).toFixed(2);
    }
    return 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SwapHoriz /> {id ? 'Editar Tránsito Tarifa' : 'Registrar Nueva Tránsito Tarifa'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Selección de Trámite y Proveedor */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment fontSize="small" /> Información General
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                select
                label="Trámite"
                name="tramite_id"
                value={tramite_id || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Assignment /></InputAdornment>,
                }}
                helperText="Seleccione el trámite"
              >
                <MenuItem value="">
                  <em>Seleccione un trámite</em>
                </MenuItem>
                {Array.isArray(tramites) && tramites.filter(t => t.is_active).map((tramite) => (
                  <MenuItem key={tramite.id} value={tramite.id}>
                    {tramite.nombre} - {tramite.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                fullWidth
                options={Array.isArray(providers) ? providers.filter(p => p.is_active) : []}
                value={providers.find(p => p.id === proveedor_id) || null}
                onChange={(event, newValue) => {
                  dispatch(handleFormStoreThunk({
                    name: 'proveedor_id',
                    value: newValue ? newValue.id : ''
                  }));
                }}
                getOptionLabel={(option) => `${option.codigo_encargado} - ${option.nombre}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gestor"
                    required
                    helperText="Seleccione el gestor"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Tarifas */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney fontSize="small" /> Tarifas
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Servicio Gestor"
                name="servicio_proveedor"
                type="number"
                value={servicio_proveedor || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>,
                }}
                helperText="Precio que cobra el Gestor"
                inputProps={{
                  min: 0,
                  step: "0.01"
                }}
              />

              <TextField
                fullWidth
                label="Servicio Empresa"
                name="servicio_empresa"
                type="number"
                value={servicio_empresa || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>,
                }}
                helperText="Precio que cobra la empresa al cliente"
                inputProps={{
                  min: 0,
                  step: "0.01"
                }}
              />

              {/* Mostrar margen si hay valores */}
              {servicio_proveedor && servicio_empresa && (
                <Box sx={{
                  p: 2,
                  backgroundColor: 'rgba(0, 168, 89, 0.1)',
                  borderRadius: 1,
                  border: '1px solid rgba(0, 168, 89, 0.3)'
                }}>
                  <Typography variant="body2" fontWeight={600} color="primary" gutterBottom>
                    💰 Margen de Ganancia
                  </Typography>
                  <Typography variant="body2">
                    Diferencia: <strong>${calcularMargen().toLocaleString('es-CO')}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Porcentaje: <strong>{calcularPorcentajeMargen()}%</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          className="action-button"
          sx={{
            background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
            }
          }}
        >
          {id ? '💾 Guardar Cambios' : '✨ Crear Tarifa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
