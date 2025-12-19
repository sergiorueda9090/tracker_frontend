import React from 'react';
import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  'en_verificacion': {
    label: 'En verificación',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  'para_radicacion': {
    label: 'Para radicación',
    color: '#00A859',
    bgColor: '#D1FAE5',
  },
  'en_novedad': {
    label: 'En novedad',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  'enviado': {
    label: 'Enviado',
    color: '#64748B',
    bgColor: '#F1F5F9',
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['enviado'];

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: '24px',
        borderRadius: '6px',
        '& .MuiChip-label': {
          padding: '0 8px',
        },
      }}
    />
  );
};

export default StatusBadge;
