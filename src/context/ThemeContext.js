// src/context/ThemeContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_THEME, applyTheme, getThemeById } from '../config/themesConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Intentar cargar el tema guardado
    const savedThemeId = localStorage.getItem('tracker_theme_id');
    const savedCustomTheme = localStorage.getItem('tracker_custom_theme');

    if (savedCustomTheme) {
      return JSON.parse(savedCustomTheme);
    }

    if (savedThemeId) {
      return getThemeById(savedThemeId);
    }

    return DEFAULT_THEME;
  });

  useEffect(() => {
    // Aplicar el tema al documento
    applyTheme(currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeOrId) => {
    let newTheme;

    if (typeof themeOrId === 'string') {
      // Es un ID de tema predefinido
      newTheme = getThemeById(themeOrId);
      localStorage.setItem('tracker_theme_id', themeOrId);
      localStorage.removeItem('tracker_custom_theme');
    } else {
      // Es un tema personalizado
      newTheme = themeOrId;
      localStorage.setItem('tracker_custom_theme', JSON.stringify(themeOrId));
      localStorage.removeItem('tracker_theme_id');
    }

    setCurrentTheme(newTheme);
  };

  const resetTheme = () => {
    localStorage.removeItem('tracker_theme_id');
    localStorage.removeItem('tracker_custom_theme');
    setCurrentTheme(DEFAULT_THEME);
  };

  const value = {
    currentTheme,
    changeTheme,
    resetTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};