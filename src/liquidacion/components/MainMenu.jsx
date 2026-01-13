import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit,
  Delete,
  Lock,
  LockOpen,
} from '@mui/icons-material';

const MainMenu = ({ anchorEl, open, onClose, tramite, onEdit, onDelete, onToggleActive }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => onEdit(tramite)}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Editar</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => onToggleActive(tramite)}>
        <ListItemIcon>
          {tramite?.is_active ? (
            <Lock fontSize="small" />
          ) : (
            <LockOpen fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>
          {tramite?.is_active ? 'Desactivar' : 'Activar'}
        </ListItemText>
      </MenuItem>

      <MenuItem onClick={() => onDelete(tramite)} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <Delete fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Eliminar</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MainMenu;
