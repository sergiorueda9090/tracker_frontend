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
  Autocomplete,
} from '@mui/material';
import { Business, LocationOn, Badge, Description } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from "../../store/clienteStore/clienteThunks";
import { getAllThunks as getAllDepartamentos, showThunk as showMunicipios } from '../../store/departamentosMunicipiosStore/departamentosMunicipiosThunks';
import { showAlert } from "../../store/globalStore/globalStore";

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    id,
    nombre,
    razon_social,
    nit,
    departamento_id,
    ciudad_id
  } = useSelector(state => state.clienteStore);

  const { departamentos, municipios } = useSelector(state => state.departamentosMunicipiosStore);

  useEffect(() => {
    dispatch(getAllDepartamentos());
    if (departamento_id) {
      dispatch(showMunicipios(departamento_id));
    }
  }, [departamento_id, dispatch]);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const handleAutocompleteChange = (name, newValue) => {
    const value = newValue ? newValue.id : '';
    dispatch(handleFormStoreThunk({ name, value }));

    // Resetear ciudad si cambia el departamento
    if (name === 'departamento_id') {
      dispatch(handleFormStoreThunk({ name: 'ciudad_id', value: '' }));
    }
  };

  const handleSave = () => {
    // Validaciones básicas
    if (!nombre.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El nombre del cliente es obligatorio.",
      }));
      return;
    }

    if (!razon_social.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "La razón social es obligatoria.",
      }));
      return;
    }

    if (!nit.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El NIT es obligatorio.",
      }));
      return;
    }

    if (!departamento_id) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Selección Requerida",
        text: "Debe seleccionar un departamento.",
      }));
      return;
    }

    if (!ciudad_id) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Selección Requerida",
        text: "Debe seleccionar una ciudad.",
      }));
      return;
    }

    // Preparar datos
    const data = {
      nombre,
      razon_social,
      nit,
      departamento_id,
      ciudad_id
    };

    // Llamar al thunk correspondiente
    if (id) {
      dispatch(updateThunks(id, data));
    } else {
      dispatch(createThunks(data));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Business /> {id ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Información Básica */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description fontSize="small" /> Información del Cliente
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre del Cliente"
                name="nombre"
                value={nombre || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Business /></InputAdornment>,
                }}
                helperText="Nombre comercial o de fantasía"
              />

              <TextField
                fullWidth
                label="Razón Social"
                name="razon_social"
                value={razon_social || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Description /></InputAdornment>,
                }}
                helperText="Razón social registrada legalmente"
              />

              <TextField
                fullWidth
                label="NIT"
                name="nit"
                value={nit || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Badge /></InputAdornment>,
                }}
                helperText="Número de Identificación Tributaria"
                disabled={!!id} // Deshabilitar NIT en modo edición
              />
            </Box>
          </Box>

          {/* Ubicación */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" /> Ubicación
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Autocomplete Departamento */}
              <Autocomplete
                fullWidth
                options={departamentos.map(d => ({
                  label: d.departamento,
                  id: d.id_departamento
                }))}
                value={
                  departamentos
                    .map(d => ({ label: d.departamento, id: d.id_departamento }))
                    .find(opt => opt.id == departamento_id) || null
                }
                onChange={(event, newValue) => handleAutocompleteChange('departamento_id', newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Departamento" required />
                )}
                noOptionsText="No hay departamentos"
              />

              {/* Autocomplete Ciudad/Municipio */}
              <Autocomplete
                fullWidth
                disabled={!departamento_id}
                options={municipios.map(m => ({
                  label: m.municipio,
                  id: m.id_municipio
                }))}
                value={
                  municipios
                    .map(m => ({ label: m.municipio, id: m.id_municipio }))
                    .find(opt => opt.id == ciudad_id) || null
                }
                onChange={(event, newValue) => handleAutocompleteChange('ciudad_id', newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ciudad/Municipio"
                    required
                    helperText={!departamento_id ? "Selecciona primero un departamento" : ""}
                  />
                )}
                noOptionsText={departamento_id ? "No hay ciudades" : "Selecciona un departamento"}
              />
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
          {id ? '💾 Guardar Cambios' : '✨ Crear Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
