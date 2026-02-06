import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Send,
  Schedule,
  ReportProblem,
  Cancel,
  TaskAlt,
} from '@mui/icons-material';

const statuses = [
  {
    label: 'APROBADO',
    description: 'En RUNT ya aparece aprobado el trámite',
    color: '#16a34a',
    bgLight: 'rgba(22, 163, 74, 0.1)',
    icon: CheckCircle,
  },
  {
    label: 'ENTREGADO',
    description: 'La tarjeta o los documentos soporte fueron recibidos en el establecimiento del cliente',
    color: '#2563eb',
    bgLight: 'rgba(37, 99, 235, 0.1)',
    icon: LocalShipping,
  },
  {
    label: 'ENVIADO',
    description: 'El trámite fue enviado al municipio de la entidad de Tránsito correspondiente para su radicación',
    color: '#0891b2',
    bgLight: 'rgba(8, 145, 178, 0.1)',
    icon: Send,
  },
  {
    label: 'PTE AGENDA',
    description: 'Pendiente agendamiento por la entidad de Tránsito',
    color: '#d97706',
    bgLight: 'rgba(217, 119, 6, 0.1)',
    icon: Schedule,
  },
  {
    label: 'NOVEDAD',
    description: 'Surgió una novedad de documentos, impuestos, derechos o embargos antes o durante radicación en la entidad de Tránsito',
    color: '#ea580c',
    bgLight: 'rgba(234, 88, 12, 0.1)',
    icon: ReportProblem,
  },
  {
    label: 'RECHAZADO',
    description: 'Gero solicita devolución del trámite por novedad en documentación, impuestos, derechos o embargos',
    color: '#dc2626',
    bgLight: 'rgba(220, 38, 38, 0.1)',
    icon: Cancel,
  },
  {
    label: 'FINALIZADO',
    description: 'El trámite ha sido completado exitosamente',
    color: '#7c3aed',
    bgLight: 'rgba(124, 58, 237, 0.1)',
    icon: TaskAlt,
  },
];

const StatusLegend = () => {
  return (
    <Box
      sx={{
        mt: 3,
        mx: 2,
        mb: 2,
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: 'text.secondary',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
        }}
      >
        Convención de estados
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          },
          gap: 1.5,
        }}
      >
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <Box
              key={status.label}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: status.bgLight,
                transition: 'background-color 0.2s',
              }}
            >
              <Chip
                icon={<Icon sx={{ fontSize: 16, color: `${status.color} !important` }} />}
                label={status.label}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  color: status.color,
                  bgcolor: 'transparent',
                  border: `1.5px solid ${status.color}`,
                  height: 26,
                  flexShrink: 0,
                  '& .MuiChip-label': { px: 0.8 },
                  '& .MuiChip-icon': { ml: 0.5 },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.5,
                  fontSize: '0.75rem',
                  pt: 0.3,
                }}
              >
                {status.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default StatusLegend;
