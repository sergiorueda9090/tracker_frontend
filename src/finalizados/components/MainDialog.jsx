import React, { useState, useEffect, use } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, InputAdornment,
  MenuItem, Divider, Grid, Autocomplete
} from '@mui/material';
import {
  DirectionsCar, LocationOn, Assignment
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from '../../store/trackerStore/trackerThunks';
import { getAllThunks as getAllDepartamentos, showThunk as showMunicipios } from '../../store/departamentosMunicipiosStore/departamentosMunicipiosThunks';
import { getAllThunks as getAllProveedores } from '../../store/proveedoresStore/proveedoresThunks';

import { getAllThunks as getAllPreparaciones } from '../../store/preparacionStore/preparacionThunks';

import { showAlert } from "../../store/globalStore/globalStore";

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    id, placa, departamento, municipio, tipo_vehiculo,
    estado, estado_detalle, fecha_recepcion_municipio, proveedor, preparacion
  } = useSelector(state => state.trackerStore);

  const { departamentos, municipios } = useSelector(state => state.departamentosMunicipiosStore);
  const { providers } = useSelector(state => state.proveedoresStore);
  const {  tramites }   = useSelector(state => state.preparacionStore);

  console.log("Tramites:", tramites);
  console.log("providers:", providers);

  useEffect(() => {
    dispatch(getAllDepartamentos());
    if (departamento) {
      dispatch(showMunicipios(departamento));
    }
  }, [departamento, dispatch]);

  useEffect(() => {
    dispatch(getAllProveedores());
    dispatch(getAllPreparaciones());
  }, [dispatch]);



  // Tipos de vehículo
  const tiposVehiculo = [
    'AUTOMOVIL',
    'MOTOCICLETA',
    'CAMIONETA',
    'CAMION',
    'BUS',
    'TAXI',
    'OTRO'
  ];

  // Estados disponibles
  const estadosDisponibles = [
    { value: 'EN_RADICACION', label: 'En Radicación' },
    { value: 'CON_NOVEDAD', label: 'Con Novedad' },
    { value: 'FINALIZADO', label: 'Finalizado' },
  ];

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const handleSave = () => {
    if (!placa || !departamento || !municipio || !tipo_vehiculo) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Formulario Incompleto",
        text: "Los campos Placa, Departamento, Municipio y Tipo de Vehículo son obligatorios."
      }));
      return;
    }

    const dataToSend = {
      placa: placa.toUpperCase(),
      departamento: departamento,
      municipio: municipio,
      tipo_vehiculo: tipo_vehiculo,
      estado: estado,
      estado_detalle: estado_detalle,
      fecha_recepcion_municipio: fecha_recepcion_municipio || null,
      proveedor: proveedor || null,
      preparacion: preparacion || null,
    };

    if (id) {
      dispatch(updateThunks(id, dataToSend));
    } else {
      dispatch(createThunks(dataToSend));
    }
  };

  const handleAutocompleteChange = (name, newValue) => {
    const value = newValue ? newValue.id : '';
    dispatch(handleFormStoreThunk({ name, value }));

    if (name === 'departamento') {
      dispatch(handleFormStoreThunk({ name: 'municipio', value: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assignment /> {id ? 'Editar Trámite en Tracker' : 'Registrar Nuevo Trámite en Tracker'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Placa y Tipo de Vehículo */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Placa del Vehículo"
              name="placa"
              value={placa || ''}
              onChange={handleChangeForm}
              required
              placeholder="ABC123"
              inputProps={{ style: { textTransform: 'uppercase' } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><DirectionsCar /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              select
              label="Tipo de Vehículo"
              name="tipo_vehiculo"
              value={tipo_vehiculo || ''}
              onChange={handleChangeForm}
              required
            >
              {tiposVehiculo.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Ubicación */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" /> Ubicación del Trámite
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Autocomplete
                fullWidth
                options={departamentos.map(d => ({
                  label: d.departamento,
                  id: d.id_departamento
                }))}
                value={
                  departamentos
                    .map(d => ({ label: d.departamento, id: d.id_departamento }))
                    .find(opt => opt.id == departamento) || null
                }
                onChange={(event, newValue) => handleAutocompleteChange('departamento', newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Departamento" required />
                )}
                noOptionsText="No hay departamentos"
              />

              <Autocomplete
                fullWidth
                disabled={!departamento}
                options={municipios.map(m => ({
                  label: m.municipio,
                  id: m.id_municipio
                }))}
                value={
                  municipios
                    .map(m => ({ label: m.municipio, id: m.id_municipio }))
                    .find(opt => opt.id == municipio) || null
                }
                onChange={(event, newValue) => handleAutocompleteChange('municipio', newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Municipio" required />
                )}
                noOptionsText="Seleccione un departamento primero"
              />
            </Box>
          </Box>

          {/* Estado y Fecha */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Estado del Trámite"
              name="estado"
              value={estado || 'EN_RADICACION'}
              onChange={handleChangeForm}
            >
              {estadosDisponibles.map((est) => (
                <MenuItem key={est.value} value={est.value}>
                  {est.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="date"
              label="Fecha de Recepción en Municipio"
              name="fecha_recepcion_municipio"
              value={fecha_recepcion_municipio || ''}
              onChange={handleChangeForm}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Estado Detalle */}
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Detalle del Estado"
              name="estado_detalle"
              value={estado_detalle || ''}
              onChange={handleChangeForm}
              placeholder="Descripción detallada del estado actual (opcional)"
            />
          </Box>

          {/* Información Adicional */}
          <Box>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                INFORMACIÓN ADICIONAL (OPCIONAL)
              </Typography>
            </Divider>
            <Box sx={{ display: 'flex', gap: 2 }}>

            <Autocomplete
              fullWidth
              options={providers.map(d => ({
                label: d.nombre,
                codigo: d.codigo_encargado,
                id: d.id
              }))}
              value={
                providers
                  .map(d => ({
                    label: d.nombre,
                    codigo: d.codigo_encargado,
                    id: d.id
                  }))
                  .find(opt => opt.id == proveedor) || null
              }
              onChange={(event, newValue) =>
                handleAutocompleteChange('proveedor', newValue)
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      Código ({option.codigo})
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Proveedor" required />
              )}
              noOptionsText="No hay proveedores"
            />
              <Autocomplete
                fullWidth
                options={tramites.map(d => ({
                  label: d.usuario,
                  id: d.id
                }))}
                value={
                  tramites
                    .map(d => ({ label: d.usuario, id: d.id }))
                    .find(opt => opt.id == preparacion) || null
                }
                onChange={(event, newValue) => handleAutocompleteChange('preparacion', newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Preparación" required />
                )}
                noOptionsText="No hay preparaciones"
              />
            </Box>
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC' }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ bgcolor: '#00A859', '&:hover': { bgcolor: '#008e4a' }, px: 4 }}
        >
          {id ? 'Guardar Cambios' : 'Registrar Trámite'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
