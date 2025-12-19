import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, InputAdornment,
  Chip, Autocomplete
} from '@mui/material';
import { WhatsApp, LocationOn, Traffic, ContactPage, Badge as BadgeIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Thunks
import { getAllThunks as getAllDepartamentos, showThunk as showMunicipios } from '../../store/departamentosMunicipiosStore/departamentosMunicipiosThunks';
import { handleFormStoreThunk, createThunks, updateThunks } from "../../store/proveedoresStore/proveedoresThunks";
import { showAlert } from "../../store/globalStore/globalStore";

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  
  const { 
    id, nombre, whatsapp, departamento, municipio, 
    transitos_habilitados, codigo_encargado 
  } = useSelector(state => state.proveedoresStore);
  
  const { departamentos, municipios } = useSelector(state => state.departamentosMunicipiosStore);
  
  const datattt = departamentos.find(d => d.id_departamento == departamento);
 

  useEffect(() => {
    dispatch(getAllDepartamentos());
    if (departamento) {
      dispatch(showMunicipios(departamento));
    }
  }, [departamento, dispatch]);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  // ✅ Nuevo Handler para Autocomplete (Dept y Mun)
  const handleAutocompleteChange = (name, newValue) => {
    // Si newValue es null (limpieza del buscador), enviamos string vacío
    const value = newValue ? newValue.id : '';
    dispatch(handleFormStoreThunk({ name, value }));

    // Resetear municipio si cambia el departamento
    if (name === 'departamento') {
      dispatch(handleFormStoreThunk({ name: 'municipio', value: '' }));
    }
  };

  const handleTransitosChange = (event, newValue) => {
    dispatch(handleFormStoreThunk({ 
      name: 'transitos_habilitados', 
      value: newValue 
    }));
  };

  const handleSave = () => {
    if (!nombre || !whatsapp || !departamento || !municipio || !codigo_encargado) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Formulario Incompleto",
        text: "Todos los campos marcados son obligatorios."
      }));
      return;
    }
    
    const payload = { 
      nombre, whatsapp, departamento, municipio, 
      transitos_habilitados:JSON.stringify(transitos_habilitados), codigo_encargado 
    };

    if (id) {
      dispatch(updateThunks(id, payload));
    } else {
      dispatch(createThunks(payload));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <BadgeIcon /> {id ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre Completo / Razón Social"
              name="nombre"
              value={nombre || ''}
              onChange={handleChangeForm}
              required
            />
            <TextField
              sx={{ width: '40%' }}
              label="Código Encargado"
              name="codigo_encargado"
              value={codigo_encargado || ''}
              onChange={handleChangeForm}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><ContactPage /></InputAdornment>,
              }}
            />
          </Box>

          {/* --- SECCIÓN DE UBICACIÓN CON BUSCADOR --- */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" /> Ubicación y Jurisdicción
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              
              {/* Autocomplete Departamento */}
              <Autocomplete
                fullWidth
                // Transformamos la lista a objetos {label, id}
                options={departamentos.map(d => ({ 
                  label: d.departamento, 
                  id: d.id_departamento 
                }))}
                // Buscamos el objeto que coincida con el ID que tienes en el store
                value={
                  departamentos
                    .map(d => ({ label: d.departamento, id: d.id_departamento }))
                    .find(opt => opt.id == departamento) || null
                }
                onChange={(event, newValue) => handleAutocompleteChange('departamento', newValue)}
                // Esto es vital para que MUI sepa cómo comparar los objetos
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Departamento" required />
                )}
                // Mensaje por si no hay datos cargados aún
                noOptionsText="No hay departamentos"
              />

              {/* Autocomplete Municipio */}
              <Autocomplete
                fullWidth
                disabled={!departamento}
                options={municipios.map(m => ({ 
                  label: m.municipio, 
                  id: m.id_municipio 
                }))}
                // Buscamos el objeto que coincida con el ID del municipio en el store
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

          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <TextField
              fullWidth
              label="WhatsApp"
              name="whatsapp"
              value={whatsapp || ''}
              onChange={handleChangeForm}
              required
              placeholder="3001234567"
              InputProps={{
                startAdornment: <InputAdornment position="start"><WhatsApp /></InputAdornment>,
              }}
            />
            
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={Array.isArray(transitos_habilitados) ? transitos_habilitados : []}
              onChange={handleTransitosChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tránsitos Habilitados"
                  placeholder="Escriba y presione Enter"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start"><Traffic /></InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} color="secondary" size="small" key={index} />
                ))
              }
            />
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
          {id ? 'Guardar Cambios' : 'Registrar Proveedor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;