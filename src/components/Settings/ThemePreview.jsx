// src/components/Settings/ThemePreview.jsx

import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Check } from '@mui/icons-material';
import '../../styles/ThemePreview.css';

const ThemePreview = ({ theme, isSelected, onSelect }) => {
  const previewStyle = {
    '--preview-primary': theme.colors.primary,
    '--preview-secondary': theme.colors.secondary,
    '--preview-surface': theme.colors.surface,
    '--preview-text': theme.colors.text,
    '--preview-border': theme.colors.border,
    '--preview-radius': theme.spacing.borderRadius,
  };

  return (
    <Paper
      className={`theme-preview-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={previewStyle}
    >
      {isSelected && (
        <Box className="theme-selected-badge">
          <Check fontSize="small" />
        </Box>
      )}

      <Box className="theme-preview-header">
        <Typography variant="h6" className="theme-preview-emoji">
          {theme.emoji}
        </Typography>
        <Typography variant="h6" className="theme-preview-name">
          {theme.name}
        </Typography>
      </Box>

      <Typography variant="body2" className="theme-preview-description">
        {theme.description}
      </Typography>

      {/* Vista previa de colores */}
      <Box className="theme-preview-colors">
        <Box
          className="theme-preview-color"
          style={{ background: theme.colors.primary }}
        />
        <Box
          className="theme-preview-color"
          style={{ background: theme.colors.secondary }}
        />
        <Box
          className="theme-preview-color"
          style={{ background: theme.colors.success }}
        />
        <Box
          className="theme-preview-color"
          style={{ background: theme.colors.warning }}
        />
      </Box>

      {/* Mini simulación de interfaz */}
      <Box className="theme-preview-demo">
        <Box className="theme-demo-element primary" />
        <Box className="theme-demo-element secondary" />
        <Box className="theme-demo-element accent" />
      </Box>
    </Paper>
  );
};

export default ThemePreview;