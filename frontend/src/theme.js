import { createTheme } from '@mui/material/styles';

// TWILL HOME Luxury Palette
const twillColors = {
  navyMain: '#0B1C33',   // Midnight Navy
  navyDark: '#050D1A',   // Deepest Navy
  navyLight: '#1A2E4D',  // Lighter Navy
  goldMain: '#D4AF37',   // Champagne Gold
  goldLight: '#F3E5AB',  // Pale Gold
  slateMain: '#708090',  // Slate Grey
  slateLight: '#EBE9E4', // Off-white/Beige tint for backgrounds
  black: '#1A1A1A',      // Soft Black
  white: '#FFFFFF',
  textSecondary: '#5A6A78'
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: twillColors.navyMain,
      dark: twillColors.navyDark,
      light: twillColors.navyLight,
      contrastText: twillColors.white,
    },
    secondary: {
      main: twillColors.goldMain,
      light: twillColors.goldLight,
      contrastText: twillColors.navyMain,
    },
    background: {
      default: twillColors.slateLight,
      paper: twillColors.white,
    },
    text: {
      primary: twillColors.navyMain,
      secondary: twillColors.textSecondary,
    },
    divider: 'rgba(11, 28, 51, 0.12)', // Navy tint divider
  },
  typography: {
    fontFamily: [
      '"Playfair Display"', // Serif for headings
      '"Inter"',            // Sans-serif for body
      'sans-serif',
    ].join(','),
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h6: { fontFamily: '"Inter", sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    body1: { fontFamily: '"Inter", sans-serif' },
    body2: { fontFamily: '"Inter", sans-serif' },
  },
  shape: {
    borderRadius: 4, // Sharper corners for luxury feel
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: twillColors.slateLight,
          color: twillColors.navyMain,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp edges for luxury
          padding: '12px 28px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
           backgroundColor: twillColors.navyMain,
           '&:hover': {
              backgroundColor: twillColors.navyLight,
           }
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: twillColors.navyMain,
          color: twillColors.white,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
            }
        }
    }
  },
});

export default theme;
