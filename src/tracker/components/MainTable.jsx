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
  CheckCircle,
  Warning,
  HourglassEmpty,
  History,
  LocalShipping,
  DoneAll
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showAlert } from "../../store/globalStore/globalStore";

import { getAllThunks, showThunk, deleteThunk, showhistoryThunk } from '../../store/trackerStore/trackerThunks';
import Pagination from './Pagination';

const MainTable = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { dispatch(getAllThunks()); }, [dispatch]);

  const { tramites } = useSelector(state => state.trackerStore);

  const handleAction = (id) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (tramite) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar el trámite con placa "${tramite.placa}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar trámite",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(tramite.id));
      }
    }));
  };

  const handleVerTrazabilidad = (id) => {
    //dispatch(showhistoryThunk(id));
    navigate(`/tracker/history/${id}`);
  };

  // Función para obtener el chip de estado
  const getEstadoChip = (estado) => {
    const estados = {
      'EN_RADICACION': {
        label: 'En Radicación',
        color: 'info',
        icon: <HourglassEmpty fontSize="small" />
      },
      'CON_NOVEDAD': {
        label: 'Con Novedad',
        color: 'warning',
        icon: <Warning fontSize="small" />
      },
      'FINALIZADO': {
        label: 'Finalizado',
        color: 'success',
        icon: <CheckCircle fontSize="small" />
      }
    };

    const estadoConfig = estados[estado] || estados['EN_RADICACION'];

    return (
      <Chip
        label={estadoConfig.label}
        size="small"
        color={estadoConfig.color}
        icon={estadoConfig.icon}
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // Función para formatear hace días
  const getHaceDiasChip = (haceDias) => {
    if (haceDias === null || haceDias === undefined) {
      return <Chip label="Sin fecha" size="small" variant="outlined" />;
    }

    let color = 'success';
    let label = `${haceDias} días`;

    if (haceDias > 30) {
      color = 'error';
    } else if (haceDias > 15) {
      color = 'warning';
    }

    return <Chip label={label} size="small" color={color} sx={{ fontWeight: 600 }} />;
  };

  return (
    <Paper className="page-paper">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Placa</strong></TableCell>
              <TableCell><strong>Tipo Vehículo</strong></TableCell>
              <TableCell><strong>Ubicación</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Fecha Recepción</strong></TableCell>
              <TableCell align="center"><strong>Hace</strong></TableCell>
              <TableCell><strong>Proveedor</strong></TableCell>
              <TableCell><strong>Código Encargado</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tramites.map((tramite) => (
                <TableRow key={tramite.id} className="table-row">
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      #{tramite.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {tramite.placa}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {tramite.tipo_vehiculo}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tramite.nombre_depto || 'N/A'} - {tramite.nombre_muni || 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {getEstadoChip(tramite.estado)}
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {tramite.fecha_recepcion_municipio
                        ? new Date(tramite.fecha_recepcion_municipio).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Sin fecha'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {getHaceDiasChip(tramite.hace_dias)}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {tramite.proveedor_nombre || 'Sin asignar'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="secondary">
                      {tramite.codigo_encargado || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {tramite.usuario || 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => handleAction(tramite.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleDelete(tramite)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Ver Historial">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleVerTrazabilidad(tramite.id)}
                        >
                          <History fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Finalizar Trámite">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleVerTrazabilidad(tramite.id)}
                        >
                          <DoneAll fontSize="small" />
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
      <Pagination />
    </Paper>
  );
};

export default MainTable;
