import { createTheme } from '@mui/material/styles';

// Sweet Oliver Green Palette
const noonColors = {
  oliveMain: '#556B2F', // Dark Olive Green - Elegant and Premium
  oliveDark: '#3B4D1F', // Darker shade for hover
  oliveLight: '#8F9779', // Lighter accent
  black: '#2C3439',     // Softer Black
  white: '#FFFFFF',
  greyBg: '#F4F6F3',    // Very light greenish-grey tint for background
  textSecondary: '#6D7478',
  divider: '#E0E4DE',
  success: '#4CAF50',
  error: '#D32F2F',
  info: '#0288D1'
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: noonColors.oliveMain,
      dark: noonColors.oliveDark,
      light: noonColors.oliveLight,
      contrastText: noonColors.white,
    },
    secondary: {
      main: noonColors.black,
      contrastText: noonColors.white,
    },
    error: {
      main: noonColors.error,
    },
    success: {
      main: noonColors.success,
    },
    info: {
      main: noonColors.info,
    },
    background: {
      default: noonColors.greyBg,
      paper: noonColors.white,
    },
    text: {
      primary: noonColors.black,
      secondary: noonColors.textSecondary,
    },
    divider: noonColors.divider,
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Outfit"', // Adding Outfit for a friendlier "sweet" look if available, else Inter
      '"Roboto"',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, fontSize: '0.9rem' },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12, // More rounded = sweeter
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: noonColors.greyBg,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(85, 107, 47, 0.2)', // Olive shadow
          },
        },
        containedPrimary: {
           '&:hover': {
              backgroundColor: noonColors.oliveDark,
           }
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: noonColors.oliveMain,
          color: noonColors.white,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                border: '1px solid transparent',
                borderRadius: '16px',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(85, 107, 47, 0.15)', // Olive shadow on hover
                    borderColor: noonColors.oliveLight,
                }
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 600,
                borderRadius: '8px',
            }
        }
    },
     MuiIconButton: {
        styleOverrides: {
            root: {
                transition: 'all 0.2s',
                '&:hover': {
                    color: noonColors.oliveMain,
                    backgroundColor: 'rgba(85, 107, 47, 0.08)'
                }
            }
        }
    }
  },
});

export default theme;
