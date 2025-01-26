import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#324A5F',
      light: '#4A6B84',
      dark: '#1B2A41',
      contrastText: '#CCC9DC',
    },
    secondary: {
      main: '#CCC9DC',
      light: '#E8E6F2',
      dark: '#9B98A9',
      contrastText: '#0C1821',
    },
    text: {
      primary: '#0C1821',
      secondary: '#324A5F',
    },
    background: {
      default: '#CCC9DC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      color: '#0C1821',
      fontWeight: 700,
    },
    h5: {
      color: '#324A5F',
      fontWeight: 600,
    },
    body1: {
      color: '#1B2A41',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          borderColor: '#1B2A41',
        },
      },
    },
  },
}); 