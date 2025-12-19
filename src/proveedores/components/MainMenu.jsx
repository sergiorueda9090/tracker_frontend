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
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const MainMenu = ({ anchorEl, open, onClose, category, onEdit, onDelete, onToggleActive }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => onEdit(category)}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Editar</ListItemText>
      </MenuItem>
      
      <MenuItem onClick={() => onToggleActive(category)}>
        <ListItemIcon>
          {category?.isActive ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>
          {category?.isActive ? 'Desactivar' : 'Activar'}
        </ListItemText>
      </MenuItem>
      
      <MenuItem onClick={() => onDelete(category)} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <Delete fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Eliminar</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MainMenu;