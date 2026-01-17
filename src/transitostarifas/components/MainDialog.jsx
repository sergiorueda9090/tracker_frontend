import React, { useEffect, useState } from 'react';
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  Assignment,
  AccountCircle,
  AttachMoney,
  SwapHoriz,
  LocationOn,
  Delete,
  Add,
  Receipt,
  PersonAdd,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from "../../store/transitosTarifasStore/transitosTarifasThunks";
import { resetFormStore } from "../../store/transitosTarifasStore/transitosTarifasStore";
import { showAlert } from "../../store/globalStore/globalStore";
import { getAllThunks as getAllTramites } from "../../store/tramitesStore/tramitesThunks";
import { getAllThunks as getAllProveedores } from "../../store/proveedoresStore/proveedoresThunks";
import { getAllThunks as getAllDepartamentos, showThunk as showMunicipios } from '../../store/departamentosMunicipiosStore/departamentosMunicipiosThunks';

// Funciones helper para formato de números colombiano
const formatNumberColombia = (value) => {
  if (!value && value !== 0) return '';
  const numericValue = String(value).replace(/\./g, '').replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return new Intl.NumberFormat('es-CO').format(parseInt(numericValue, 10));
};

const unformatNumber = (value) => {
  if (!value) return '';
  return String(value).replace(/\./g, '');
};

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  
  const {
    id,
    departamento,
    municipio,
    tramites_data: tramitesDataFromStore,
  } = useSelector(state => state.transitosTarifasStore);

  const { departamentos, municipios } = useSelector(state => state.departamentosMunicipiosStore);
  const { tramites } = useSelector(state => state.tramitesStore);
  const { providers } = useSelector(state => state.proveedoresStore);

  // Estado local: Array de trámites, cada uno con sus gestores
  const [tramitesConfig,      setTramitesConfig] = useState([]);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState('');
  const [gestorSeleccionado,  setGestorSeleccionado] = useState(null);
  const [tramiteActualIndex,  setTramiteActualIndex] = useState(null);

  useEffect(() => {
    if (open) {
      dispatch(getAllTramites({ page_size: 100 }));
      dispatch(getAllProveedores({ page_size: 100 }));
      
      // Cargar datos si está editando
      if (tramitesDataFromStore && Array.isArray(tramitesDataFromStore)) {
        setTramitesConfig(tramitesDataFromStore);
      } else {
        setTramitesConfig([]);
      }
    }
  }, [open, dispatch, tramitesDataFromStore]);

  useEffect(() => {
    dispatch(getAllDepartamentos());
    if (departamento) {
      dispatch(showMunicipios(departamento));
    }
  }, [departamento, dispatch]);

  useEffect(() => {
    dispatch(getAllProveedores());
  }, [departamento, municipio]);

  // Resetear formulario cuando se cierre el modal
  useEffect(() => {
    if (!open) {
      dispatch(resetFormStore());
      setTramitesConfig([]);
      setTramiteSeleccionado('');
      setGestorSeleccionado(null);
      setTramiteActualIndex(null);
    }
  }, [open, dispatch]);

  const handleAutocompleteChange = (name, newValue) => {
    const value = newValue ? newValue.id : '';
    dispatch(handleFormStoreThunk({ name, value }));

    if (name === 'municipio') {
      dispatch(handleFormStoreThunk({ name: 'municipio', value }));
      setTramitesConfig([]);
      return;
    }

    if (name === 'departamento') {
      dispatch(handleFormStoreThunk({ name: 'municipio', value: '' }));
      setTramitesConfig([]);
      return;
    }
  };

  // Agregar nuevo trámite
  const handleAgregarTramite = () => {
    if (!tramiteSeleccionado) {
      dispatch(showAlert({
        type: "warning",
        title: "⚠️ Seleccione un Trámite",
        text: "Debe seleccionar un trámite antes de agregarlo.",
      }));
      return;
    }

    // Verificar si el trámite ya existe
    const tramiteExiste = tramitesConfig.find(t => t.tramite_id === parseInt(tramiteSeleccionado));
    if (tramiteExiste) {
      dispatch(showAlert({
        type: "warning",
        title: "⚠️ Trámite Duplicado",
        text: "Este trámite ya fue agregado.",
      }));
      return;
    }

    const tramiteInfo = tramites.find(t => t.id === parseInt(tramiteSeleccionado));
    
    const nuevoTramite = {
      tramite_id: parseInt(tramiteSeleccionado),
      nombre_tramite: tramiteInfo ? tramiteInfo.nombre : '',
      derechos_2026: '',
      gestores: [] // Array de gestores para este trámite
    };

    setTramitesConfig([...tramitesConfig, nuevoTramite]);
    setTramiteSeleccionado('');
    
    dispatch(showAlert({
      type: "success",
      title: "✅ Trámite Agregado",
      text: `"${nuevoTramite.nombre_tramite}" fue agregado. Ahora agregue gestores.`,
    }));
  };

  // Eliminar trámite completo
  const handleEliminarTramite = (tramiteIndex) => {
    const tramiteEliminado = tramitesConfig[tramiteIndex];
    const nuevosTramites = tramitesConfig.filter((_, i) => i !== tramiteIndex);
    setTramitesConfig(nuevosTramites);
    
    dispatch(showAlert({
      type: "info",
      title: "🗑️ Trámite Eliminado",
      text: `"${tramiteEliminado.nombre_tramite}" fue eliminado.`,
    }));
  };

  // Agregar gestor a un trámite específico
  const handleAgregarGestorATramite = (tramiteIndex) => {
    if (!gestorSeleccionado) {
      dispatch(showAlert({
        type: "warning",
        title: "⚠️ Seleccione un Gestor",
        text: "Debe seleccionar un gestor antes de agregarlo.",
      }));
      return;
    }

    const nuevosTramites = [...tramitesConfig];
    const tramite = nuevosTramites[tramiteIndex];

    // Verificar si el gestor ya existe en este trámite
    const gestorExiste = tramite.gestores.find(g => g.proveedor_id === gestorSeleccionado.id);
    if (gestorExiste) {
      dispatch(showAlert({
        type: "warning",
        title: "⚠️ Gestor Duplicado",
        text: "Este gestor ya fue agregado a este trámite.",
      }));
      return;
    }

    const nuevoGestor = {
      proveedor_id: gestorSeleccionado.id,
      nombre: gestorSeleccionado.nombre,
      codigo: gestorSeleccionado.codigo_encargado,
      servicio_gestor: '',
      servicio_empresa: ''
    };

    tramite.gestores.push(nuevoGestor);
    setTramitesConfig(nuevosTramites);
    setGestorSeleccionado(null);
    setTramiteActualIndex(null);
    
    dispatch(showAlert({
      type: "success",
      title: "✅ Gestor Agregado",
      text: `"${nuevoGestor.nombre}" fue agregado a "${tramite.nombre_tramite}".`,
    }));
  };

  // Eliminar gestor de un trámite específico
  const handleEliminarGestor = (tramiteIndex, gestorIndex) => {
    const nuevosTramites = [...tramitesConfig];
    const gestorEliminado = nuevosTramites[tramiteIndex].gestores[gestorIndex];
    nuevosTramites[tramiteIndex].gestores = nuevosTramites[tramiteIndex].gestores.filter((_, i) => i !== gestorIndex);
    setTramitesConfig(nuevosTramites);
    
    dispatch(showAlert({
      type: "info",
      title: "🗑️ Gestor Eliminado",
      text: `"${gestorEliminado.nombre}" fue eliminado.`,
    }));
  };

  // Actualizar Derechos 2026 del trámite
  const handleActualizarDerechos = (tramiteIndex, valor) => {
    const nuevosTramites = [...tramitesConfig];
    nuevosTramites[tramiteIndex].derechos_2026 = valor;
    setTramitesConfig(nuevosTramites);
  };

  // Actualizar valores del gestor
  const handleActualizarGestor = (tramiteIndex, gestorIndex, campo, valor) => {
    const nuevosTramites = [...tramitesConfig];
    nuevosTramites[tramiteIndex].gestores[gestorIndex][campo] = valor;
    setTramitesConfig(nuevosTramites);
  };

  const handleSave = () => {
    // Validar ubicación
    if (!departamento || !municipio) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Ubicación Requerida",
        text: "Debe seleccionar departamento y municipio.",
      }));
      return;
    }

    // Validar que haya trámites
    if (tramitesConfig.length === 0) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Sin Trámites",
        text: "Debe agregar al menos un trámite.",
      }));
      return;
    }

    // Validar cada trámite
    for (let i = 0; i < tramitesConfig.length; i++) {
      const tramite = tramitesConfig[i];

      // Validar derechos 2026
      if (!tramite.derechos_2026 || parseFloat(tramite.derechos_2026) <= 0) {
        dispatch(showAlert({
          type: "error",
          title: "⚠️ Campo Requerido",
          text: `Debe ingresar Derechos 2026 para "${tramite.nombre_tramite}".`,
        }));
        return;
      }

      // Validar que tenga gestores
      if (tramite.gestores.length === 0) {
        dispatch(showAlert({
          type: "error",
          title: "⚠️ Sin Gestores",
          text: `Debe agregar al menos un gestor para "${tramite.nombre_tramite}".`,
        }));
        return;
      }

      // Validar cada gestor
      for (let j = 0; j < tramite.gestores.length; j++) {
        const gestor = tramite.gestores[j];

        if (!gestor.servicio_gestor || parseFloat(gestor.servicio_gestor) <= 0) {
          dispatch(showAlert({
            type: "error",
            title: "⚠️ Servicio Gestor Requerido",
            text: `Debe ingresar Servicio Gestor para "${gestor.nombre}" en "${tramite.nombre_tramite}".`,
          }));
          return;
        }

        if (!gestor.servicio_empresa || parseFloat(gestor.servicio_empresa) <= 0) {
          dispatch(showAlert({
            type: "error",
            title: "⚠️ Servicio Empresa Requerido",
            text: `Debe ingresar Servicio Empresa para "${gestor.nombre}" en "${tramite.nombre_tramite}".`,
          }));
          return;
        }
      }
    }

    // Preparar datos para enviar
    const data = {
      departamento_id: parseInt(departamento),
      municipio_id: parseInt(municipio),
      tramites: tramitesConfig.map(tramite => ({
        tramite_id: tramite.tramite_id,
        derechos_2026: parseFloat(tramite.derechos_2026),
        gestores: tramite.gestores.map(gestor => ({
          proveedor_id: gestor.proveedor_id,
          servicio_gestor: parseFloat(gestor.servicio_gestor),
          servicio_empresa: parseFloat(gestor.servicio_empresa),
        })),
      })),
    };

    console.log('📤 Datos a enviar:', data);

    // Llamar al thunk correspondiente
    if (id) {
      dispatch(updateThunks(id, data));
    } else {
      dispatch(createThunks(data));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ 
        color: '#00A859', 
        fontWeight: 'bold', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        borderBottom: '2px solid #00A859'
      }}>
        <SwapHoriz /> {id ? 'Editar Tránsitos Tarifas' : 'Registrar Tránsitos Tarifas'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Ubicación */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" /> Ubicación
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
                  <TextField {...params} label="Departamento" required size="small" />
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
                  <TextField {...params} label="Municipio" required size="small" />
                )}
                noOptionsText="Seleccione un departamento primero"
              />
            </Box>
          </Box>

          <Divider />

          {/* Agregar Trámite */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment fontSize="small" /> Agregar Trámite
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                select
                label="Seleccione un Trámite"
                value={tramiteSeleccionado}
                onChange={(e) => setTramiteSeleccionado(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Assignment /></InputAdornment>,
                }}
              >
                <MenuItem value="">
                  <em>Seleccione un trámite</em>
                </MenuItem>
                {Array.isArray(tramites) && tramites.filter(t => t.is_active).map((tramite) => (
                  <MenuItem key={tramite.id} value={tramite.id}>
                    {tramite.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAgregarTramite}
                sx={{
                  minWidth: '180px',
                  background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
                  }
                }}
              >
                Agregar Trámite
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Lista de Trámites con sus Tablas */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt fontSize="small" /> Configuración de Tarifas por Trámite
              </Typography>
              <Chip 
                label={`${tramitesConfig.length} Trámite${tramitesConfig.length !== 1 ? 's' : ''}`}
                color="primary"
                size="small"
              />
            </Box>

            {tramitesConfig.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  border: '2px dashed #ccc',
                }}
              >
                <Assignment sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  No hay trámites agregados
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Agregue trámites para comenzar a configurar las tarifas
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {tramitesConfig.map((tramite, tramiteIndex) => (
                  <Card key={tramiteIndex} variant="outlined" sx={{ border: '2px solid #00A859' }}>
                    <CardContent>
                      {/* Header del Trámite */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            📋 {tramite.nombre_tramite}
                          </Typography>
                          <Chip 
                            label={`${tramite.gestores.length} Gestor${tramite.gestores.length !== 1 ? 'es' : ''}`}
                            size="small"
                            color="info"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <IconButton
                          onClick={() => handleEliminarTramite(tramiteIndex)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {/* Derechos 2026 */}
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Derechos 2026"
                          type="text"
                          value={formatNumberColombia(tramite.derechos_2026)}
                          onChange={(e) => handleActualizarDerechos(tramiteIndex, unformatNumber(e.target.value))}
                          size="small"
                          required
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Receipt /></InputAdornment>,
                          }}
                        />
                      </Box>

                      {/* Agregar Gestor a este Trámite */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonAdd fontSize="small" /> Agregar Gestor
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Autocomplete
                            fullWidth
                            options={Array.isArray(providers) ? providers.filter(p => p.is_active) : []}
                            value={tramiteActualIndex === tramiteIndex ? gestorSeleccionado : null}
                            onChange={(event, newValue) => {
                              setGestorSeleccionado(newValue);
                              setTramiteActualIndex(tramiteIndex);
                            }}
                            getOptionLabel={(option) => `${option.codigo_encargado} - ${option.nombre}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Seleccione un Gestor"
                                size="small"
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
                          <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => handleAgregarGestorATramite(tramiteIndex)}
                            sx={{
                              minWidth: '150px',
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              }
                            }}
                          >
                            Agregar
                          </Button>
                        </Box>
                      </Box>

                      {/* Tabla de Gestores para este Trámite */}
                      {tramite.gestores.length === 0 ? (
                        <Box
                          sx={{
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            border: '1px dashed #ccc',
                          }}
                        >
                          <AccountCircle sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            No hay gestores agregados para este trámite
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Gestor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: 150 }}>Derechos 2026</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: 150 }}>Servicio Gestor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: 150 }}>Servicio Empresa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: 80 }} align="center">Acción</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tramite.gestores.map((gestor, gestorIndex) => (
                                <TableRow key={gestorIndex} hover>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                      {gestor.codigo} - {gestor.nombre}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                                      $ {new Intl.NumberFormat('es-CO').format(tramite.derechos_2026 || 0)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      value={formatNumberColombia(gestor.servicio_gestor)}
                                      onChange={(e) => handleActualizarGestor(tramiteIndex, gestorIndex, 'servicio_gestor', unformatNumber(e.target.value))}
                                      size="small"
                                      placeholder="0"
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      value={formatNumberColombia(gestor.servicio_empresa)}
                                      onChange={(e) => handleActualizarGestor(tramiteIndex, gestorIndex, 'servicio_empresa', unformatNumber(e.target.value))}
                                      size="small"
                                      placeholder="0"
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEliminarGestor(tramiteIndex, gestorIndex)}
                                      sx={{ color: '#d32f2f' }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}

                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          sx={{ fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={tramitesConfig.length === 0}
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #00A859 0%, #008A47 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #008A47 0%, #006F39 100%)',
            },
            '&:disabled': {
              background: '#ccc',
            }
          }}
        >
          {id ? '💾 Guardar Cambios' : '✨ Crear Tarifas'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;