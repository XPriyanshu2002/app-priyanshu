const common = {
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
};

const lightTheme = {
  mode: 'light',
  colors: {
    background: '#F6F9FC',
    surface: '#FFFFFF',
    text: '#13263C',
    textMuted: '#5E7287',
    border: '#D7E0EB',
    primary: '#0D6EFD',
    accent: '#00A86B',
    danger: '#C44536',
  },
  ...common,
};

const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#0A1623',
    surface: '#112133',
    text: '#E9F0F7',
    textMuted: '#B0C2D6',
    border: '#213A52',
    primary: '#4E9BFF',
    accent: '#38D39F',
    danger: '#FF7A6B',
  },
  ...common,
};

const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);

export { lightTheme, darkTheme, getTheme };
