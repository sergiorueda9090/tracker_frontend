// src/config/themesConfig.js

export const PRESET_THEMES = [
  {
    id: 'default',
    name: 'Tracker Verde',
    description: 'Tema principal de Tracker',
    emoji: '🚗',
    colors: {
      primary: '#00A859',
      primaryLight: '#008A47',
      secondary: '#F59E0B',
      success: '#00A859',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: 'rgba(0, 168, 89, 0.1)',
    },
    fonts: {
      primary: "'Poppins', sans-serif",
      secondary: "'Inter', sans-serif",
      size: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px',
        xxlarge: '24px',
      },
    },
    spacing: {
      borderRadius: '16px',
      padding: '24px',
      gap: '16px',
    },
  },
  {
    id: 'ocean',
    name: 'Océano Profundo',
    description: 'Azules profesionales y elegantes',
    emoji: '🌊',
    colors: {
      primary: '#0ea5e9',
      primaryLight: '#0284c7',
      secondary: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e',
      textSecondary: '#475569',
      border: 'rgba(14, 165, 233, 0.1)',
    },
    fonts: {
      primary: "'Roboto', sans-serif",
      secondary: "'Open Sans', sans-serif",
      size: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px',
        xxlarge: '24px',
      },
    },
    spacing: {
      borderRadius: '12px',
      padding: '20px',
      gap: '16px',
    },
  },
  {
    id: 'forest',
    name: 'Bosque Natural',
    description: 'Verdes orgánicos y naturales',
    emoji: '🌲',
    colors: {
      primary: '#059669',
      primaryLight: '#047857',
      secondary: '#34d399',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      textSecondary: '#475569',
      border: 'rgba(5, 150, 105, 0.1)',
    },
    fonts: {
      primary: "'Lato', sans-serif",
      secondary: "'Nunito', sans-serif",
      size: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px',
        xxlarge: '24px',
      },
    },
    spacing: {
      borderRadius: '14px',
      padding: '22px',
      gap: '14px',
    },
  },
  {
    id: 'sunset',
    name: 'Atardecer Cálido',
    description: 'Naranjas y rojos vibrantes',
    emoji: '🌅',
    colors: {
      primary: '#f97316',
      primaryLight: '#ea580c',
      secondary: '#fb923c',
      success: '#10b981',
      warning: '#fbbf24',
      error: '#dc2626',
      info: '#3b82f6',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#7c2d12',
      textSecondary: '#78716c',
      border: 'rgba(249, 115, 22, 0.1)',
    },
    fonts: {
      primary: "'Montserrat', sans-serif",
      secondary: "'Source Sans Pro', sans-serif",
      size: {
        small: '13px',
        medium: '15px',
        large: '17px',
        xlarge: '21px',
        xxlarge: '26px',
      },
    },
    spacing: {
      borderRadius: '18px',
      padding: '26px',
      gap: '18px',
    },
  },
  {
    id: 'midnight',
    name: 'Medianoche Elegante',
    description: 'Oscuro y sofisticado',
    emoji: '🌙',
    colors: {
      primary: '#8b5cf6',
      primaryLight: '#7c3aed',
      secondary: '#a78bfa',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
      background: '#1e1b4b',
      surface: '#312e81',
      text: '#e0e7ff',
      textSecondary: '#c7d2fe',
      border: 'rgba(139, 92, 246, 0.2)',
    },
    fonts: {
      primary: "'Raleway', sans-serif",
      secondary: "'Ubuntu', sans-serif",
      size: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px',
        xxlarge: '24px',
      },
    },
    spacing: {
      borderRadius: '16px',
      padding: '24px',
      gap: '16px',
    },
  },
  {
    id: 'cherry',
    name: 'Cereza Moderna',
    description: 'Rosas y magentas contemporáneos',
    emoji: '🍒',
    colors: {
      primary: '#ec4899',
      primaryLight: '#db2777',
      secondary: '#f472b6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#fdf2f8',
      surface: '#ffffff',
      text: '#831843',
      textSecondary: '#64748b',
      border: 'rgba(236, 72, 153, 0.1)',
    },
    fonts: {
      primary: "'Quicksand', sans-serif",
      secondary: "'Karla', sans-serif",
      size: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '19px',
        xxlarge: '23px',
      },
    },
    spacing: {
      borderRadius: '20px',
      padding: '28px',
      gap: '20px',
    },
  },
  {
    id: 'professional',
    name: 'Corporativo Pro',
    description: 'Gris profesional y minimalista',
    emoji: '💼',
    colors: {
      primary: '#475569',
      primaryLight: '#334155',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: 'rgba(71, 85, 105, 0.1)',
    },
    fonts: {
      primary: "'Inter', sans-serif",
      secondary: "'Roboto', sans-serif",
      size: {
        small: '11px',
        medium: '13px',
        large: '15px',
        xlarge: '18px',
        xxlarge: '22px',
      },
    },
    spacing: {
      borderRadius: '8px',
      padding: '16px',
      gap: '12px',
    },
  },
];

export const DEFAULT_THEME = PRESET_THEMES[0];

// Función para aplicar el tema al documento
export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Aplicar colores
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  // Aplicar fuentes
  root.style.setProperty('--theme-font-primary', theme.fonts.primary);
  root.style.setProperty('--theme-font-secondary', theme.fonts.secondary);

  // Aplicar tamaños de fuente
  Object.entries(theme.fonts.size).forEach(([key, value]) => {
    root.style.setProperty(`--theme-font-${key}`, value);
  });

  // Aplicar espaciados
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

// Función para obtener un tema por ID
export const getThemeById = (themeId) => {
  return PRESET_THEMES.find((theme) => theme.id === themeId) || DEFAULT_THEME;
};