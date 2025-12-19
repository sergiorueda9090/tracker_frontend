import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, InputAdornment,
  Autocomplete, MenuItem, Chip, IconButton, List, ListItem,
  ListItemText, ListItemSecondaryAction, Checkbox, Divider,
  Paper, Grid, Card, CardMedia, CardContent, CardActions
} from '@mui/material';
import {
  DirectionsCar, LocationOn, Assignment, Description,
  Add, Delete, Folder, CloudUpload, PictureAsPdf,
  Image as ImageIcon, Close
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Thunks
import { getAllThunks as getAllDepartamentos, showThunk as showMunicipios } from '../../store/departamentosMunicipiosStore/departamentosMunicipiosThunks';
import {
  handleFormStoreThunk, createThunks, updateThunks,
  addDocumentToList, removeDocumentFromList, toggleDocumentStatus
} from "../../store/preparacionStore/preparacionThunks";
import { showAlert } from "../../store/globalStore/globalStore";

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    id, placa, departamento, municipio, tipo_vehiculo,
    estado, paquete, lista_documentos
  } = useSelector(state => state.preparacionStore);

  const { departamentos, municipios } = useSelector(state => state.departamentosMunicipiosStore);

  const [nuevoDocumento, setNuevoDocumento] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Tipos de vehículo disponibles
  const tiposVehiculo = [
    'Automóvil',
    'Motocicleta',
    'Camioneta',
    'Camión',
    'Bus',
    'Taxi',
    'Otro'
  ];

  // Estados disponibles
  const estadosDisponibles = [
    { value: 'en_verificacion', label: 'En Verificación' },
    { value: 'para_radicacion', label: 'Para Radicación' },
    { value: 'en_novedad', label: 'En Novedad' },
    { value: 'enviado_tracker', label: 'Enviado a Tracker' },
  ];

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

  const handleAutocompleteChange = (name, newValue) => {
    const value = newValue ? newValue.id : '';
    dispatch(handleFormStoreThunk({ name, value }));

    if (name === 'departamento') {
      dispatch(handleFormStoreThunk({ name: 'municipio', value: '' }));
    }
  };

  const handleAddDocumento = () => {
    if (nuevoDocumento.trim()) {
      dispatch(addDocumentToList(nuevoDocumento.trim()));
      setNuevoDocumento('');
    }
  };

  const handleRemoveDocumento = (index) => {
    dispatch(removeDocumentFromList(index));
  };

  const handleToggleDocumento = (index) => {
    dispatch(toggleDocumentStatus(index));
  };

  // Manejo de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' ||
                         file.type === 'image/png' ||
                         file.type === 'image/jpeg' ||
                         file.type === 'image/jpg';

      if (!isValidType) {
        dispatch(showAlert({
          type: "warning",
          title: "Tipo de archivo no válido",
          text: `El archivo "${file.name}" no es PDF o PNG/JPG`
        }));
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: Date.now() + Math.random()
    }));

    setArchivos(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const handleRemoveFile = (fileId) => {
    setArchivos(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

    const formData = new FormData();
    formData.append('placa', placa.toUpperCase());
    formData.append('departamento', departamento);
    formData.append('municipio', municipio);
    formData.append('tipo_vehiculo', tipo_vehiculo);
    formData.append('estado', estado);
    formData.append('lista_documentos', JSON.stringify(lista_documentos));

    // Agregar archivos al FormData
    archivos.forEach((archivo, index) => {
      formData.append('archivos', archivo.file);
    });

    if (id) {
      dispatch(updateThunks(id, formData));
    } else {
      dispatch(createThunks(formData));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assignment /> {id ? 'Editar Trámite' : 'Registrar Nuevo Trámite'}
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

          {/* Estado */}
          <Box>
            <TextField
              fullWidth
              select
              label="Estado del Trámite"
              name="estado"
              value={estado || 'en_verificacion'}
              onChange={handleChangeForm}
            >
              {estadosDisponibles.map((est) => (
                <MenuItem key={est.value} value={est.value}>
                  {est.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Carga de Archivos - Área de Drag & Drop */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Folder fontSize="small" /> Documentos del Trámite
            </Typography>

            <Paper
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              sx={{
                border: dragActive ? '2px dashed #00A859' : '2px dashed #E2E8F0',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: dragActive ? 'rgba(0, 168, 89, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#00A859',
                  bgcolor: 'rgba(0, 168, 89, 0.05)',
                }
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: '#00A859', mb: 1 }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Arrastra archivos aquí o haz clic para seleccionar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Archivos permitidos: PDF, PNG, JPG
              </Typography>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Paper>

            {/* Lista de Archivos Subidos */}
            {archivos.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={2}>
                  Archivos Adjuntos ({archivos.length})
                </Typography>
                <Grid container spacing={2}>
                  {archivos.map((archivo) => (
                    <Grid item xs={12} sm={6} md={4} key={archivo.id}>
                      <Card sx={{
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(archivo.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            zIndex: 1,
                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>

                        {archivo.type === 'application/pdf' ? (
                          <Box sx={{
                            height: 140,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f5f5f5'
                          }}>
                            <PictureAsPdf sx={{ fontSize: 60, color: '#d32f2f' }} />
                          </Box>
                        ) : (
                          <CardMedia
                            component="img"
                            height="140"
                            image={archivo.preview}
                            alt={archivo.name}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}

                        <CardContent sx={{ pb: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            title={archivo.name}
                          >
                            {archivo.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(archivo.size)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          {/* Lista de Chequeo de Documentos */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description fontSize="small" /> Lista de Chequeo de Documentos
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Agregar documento"
                value={nuevoDocumento}
                onChange={(e) => setNuevoDocumento(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddDocumento();
                  }
                }}
                placeholder="Nombre del documento..."
              />
              <Button
                variant="contained"
                onClick={handleAddDocumento}
                startIcon={<Add />}
                sx={{ minWidth: 120 }}
              >
                Agregar
              </Button>
            </Box>

            {lista_documentos && lista_documentos.length > 0 ? (
              <Box sx={{
                border: '1px solid #E2E8F0',
                borderRadius: 2,
                maxHeight: 250,
                overflow: 'auto'
              }}>
                <List dense>
                  {lista_documentos.map((doc, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Checkbox
                          edge="start"
                          checked={doc.completado}
                          onChange={() => handleToggleDocumento(index)}
                          sx={{ color: doc.completado ? 'success.main' : 'default' }}
                        />
                        <ListItemText
                          primary={doc.nombre}
                          sx={{
                            textDecoration: doc.completado ? 'line-through' : 'none',
                            color: doc.completado ? 'text.secondary' : 'text.primary'
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" size="small" color="error" onClick={() => handleRemoveDocumento(index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < lista_documentos.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                No hay documentos en la lista. Agregue los documentos requeridos.
              </Typography>
            )}
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
