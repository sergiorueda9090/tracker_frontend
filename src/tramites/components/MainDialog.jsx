import React from 'react';
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
} from '@mui/material';
import { Assignment, Description, AttachMoney } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from "../../store/tramitesStore/tramitesThunks";
import { showAlert } from "../../store/globalStore/globalStore";

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    id,
    nombre,
    descripcion,
  } = useSelector(state => state.tramitesStore);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const handleSave = () => {
    // Validaciones básicas
    if (!nombre.trim()) {
      dispatch(showAlert({
        type: "error",
        title: "⚠️ Campo Requerido",
        text: "El nombre del trámite es obligatorio.",
      }));
      return;
    }




    // Preparar datos
    const data = {
      nombre,
      descripcion: descripcion || '',
    };

    // Llamar al thunk correspondiente
    if (id) {
      dispatch(updateThunks(id, data));
    } else {
      dispatch(createThunks(data));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#00A859', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assignment /> {id ? 'Editar Trámite' : 'Registrar Nuevo Trámite'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Información del Trámite */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description fontSize="small" /> Información del Trámite
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre del Trámite"
                name="nombre"
                value={nombre || ''}
                onChange={handleChangeForm}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Assignment /></InputAdornment>,
                }}
                helperText="Nombre descriptivo del trámite"
              />

              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={descripcion || ''}
                onChange={handleChangeForm}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Description />
                    </InputAdornment>
                  ),
                }}
                helperText="Descripción detallada del trámite (opcional)"
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
          {id ? '💾 Guardar Cambios' : '✨ Crear Trámite'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;
