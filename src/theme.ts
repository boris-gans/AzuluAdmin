import { createTheme } from '@mui/material/styles';
import { grey, red, blue } from '@mui/material/colors';

// Brutalist theme with minimalist aesthetics
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Pure black for primary
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: red[700], // Deep red for secondary actions
      light: red[500],
      dark: red[900],
      contrastText: '#ffffff',
    },
    error: {
      main: red[900],
    },
    background: {
      default: '#ffffff',
      paper: '#f9f9f9',
    },
    text: {
      primary: '#121212',
      secondary: '#555555',
    },
    divider: grey[300],
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.05em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.05em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.05em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.05em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.05em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '-0.05em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '-0.05em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '-0.05em',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      letterSpacing: '-0.05em',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      letterSpacing: '-0.05em',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '-0.05em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '-0.05em',
    },
    overline: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '-0.05em',
    },
  },
  shape: {
    borderRadius: 0, // Sharp edges for brutalist aesthetic
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          padding: '10px 16px',
          fontWeight: 500,
          textTransform: 'none',
          letterSpacing: '-0.05em',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
        elevation1: {
          boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
          border: '1px solid #000000',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.2)',
          border: '1px solid #000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderWidth: 2,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e0e0e0',
          borderWidth: 1,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e0e0',
        },
        indicator: {
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          letterSpacing: '-0.05em',
          minWidth: 100,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          '& .MuiTableCell-head': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e0e0',
          padding: '16px',
          letterSpacing: '-0.05em',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '-0.05em',
        },
      },
    },
  },
});

export default theme; 