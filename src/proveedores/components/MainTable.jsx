import React, { useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  WhatsApp,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { showAlert } from "../../store/globalStore/globalStore";

import { getAllThunks, showThunk, deleteThunk } from '../../store/proveedoresStore/proveedoresThunks';
import Pagination       from './Pagination';

const MainTable = () => {

  const dispatch = useDispatch();

  useEffect(() => {dispatch(getAllThunks());}, [dispatch]);

  const { providers } = useSelector(state => state.proveedoresStore);

  const handleAction = (id) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (proveedor) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar el proveedor "${proveedor.nombre}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar proveedor",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(proveedor.id));
      }
    }));
  };

  return (
    <Paper className="page-paper">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Proveedor / Tramitador</strong></TableCell>
              <TableCell><strong>Ubicación</strong></TableCell>
              <TableCell><strong>WhatsApp</strong></TableCell>
              <TableCell><strong>Tránsitos</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Fecha Creación</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {providers.map((prov) => (
              <TableRow key={prov.id} className="table-row">
                
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {prov.codigo_encargado}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {prov.nombre}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {prov.nombre_depto} - {prov.nombre_muni}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <WhatsApp fontSize="small" color="success" />
                    <Typography variant="body2">
                      {prov.whatsapp}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5, 
                    maxWidth: 250 // Ajusta este ancho según tu diseño
                  }}>
                    {Array.isArray(prov.transitos_habilitados) && prov.transitos_habilitados.length > 0 ? (
                      prov.transitos_habilitados.map((option, index) => (
                        <Chip
                          key={index}
                          label={option}
                          color="secondary"
                          size="small"
                          variant="outlined" // Opcional: hace que se vea más limpio en tablas
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Sin tránsitos
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={prov.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={prov.is_active ? 'success' : 'default'}
                    icon={prov.is_active ? <LockOpen /> : <Lock />}
                  />
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {new Date(prov.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => handleAction(prov.id)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDelete(prov)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Componente de Paginación */}
       <Pagination/>
    </Paper>
  );
};

export default MainTable;
