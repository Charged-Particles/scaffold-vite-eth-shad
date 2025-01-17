// Frameworks
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { grey, purple, red } from '@mui/material/colors';

import { BRANDING } from './branding';

export const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: BRANDING.THEME.PRIMARY,
    },
    secondary: {
      main: BRANDING.THEME.SECONDARY,
    },
    text: {
      secondary: BRANDING.THEME.COMMON.ghostwhite,
    },
    background: {
      default: BRANDING.THEME.BACKGROUND.default,
      paper: BRANDING.THEME.BACKGROUND.paper,
    },
    purple: {
      main: purple[300],
    },
    ...BRANDING.THEME.COMMON,
  },
  typography: {
    fontSize: 14,
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8,
  props: {
    MuiTooltip: {
      arrow: true,
    },
  },

  components: {
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }) => theme.unstable_sx({
          ...(ownerState.variant === 'tiny' && {
            ...theme.typography.caption,
            color: theme.palette.grey['300'],
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.35,
          }),
          ...(ownerState.variant === 'tight' && {
            ...theme.typography.body1,
            display: 'block',
            lineHeight: 1.4,
          }),
          ...(ownerState.variant === 'hero-watermark' && {
            ...theme.typography.h1,
            position: 'absolute',
            bottom: '-2.8rem', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '7.5rem',
            fontWeight: 900,
            whiteSpace: 'nowrap',
            opacity: 0.03,
          }),
          ...(ownerState.variant === 'prelaunch-watermark' && {
            ...theme.typography.h1,
            position: 'absolute',
            bottom: '-4.5rem', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '13rem',
            fontWeight: 900,
            whiteSpace: 'nowrap',
            opacity: 0.03,
            textAlign: 'center',
          }),
          ...(ownerState.variant === 'prelaunch-heading' && {
            ...theme.typography.h1,
            fontSize: { xs: '2.5rem', md: '3.2rem', lg: '4rem' },
            fontWeight: 900,
            textAlign: 'right',
            color: grey[600],
            textShadow: `2px 3px ${grey[300]}`,
            '& strong': {
              fontSize: { xs: '2.8rem', md: '3.5rem', lg: '4.5rem' },
              fontStyle: 'italic',
              color: BRANDING.THEME.PRIMARY,
            },
            '& em': {
              display: { xs: 'block', md: 'inline' },
              ml: 2,
              fontStyle: 'normal',
            },
          }),
          ...(ownerState.variant === 'prelaunch-word' && {
            color: red[700],
            fontSize: { xs: '2.8rem', md: '3.5rem', lg: '4.5rem' },
            fontStyle: 'italic',
          }),
          ...(ownerState.ellipsis === 'true' && {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }),
          '& em': {
            fontWeight: 'bold',
          },
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme, ownerState }) => theme.unstable_sx({
          position: 'relative !important',
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ ownerState, theme }) => theme.unstable_sx({
          ...(ownerState.variant === 'banner' && {
            border: '3px solid',
            borderColor: 'secondary.light',
            borderRadius: 3,
            px: 2.5, py: 10,
            mt: 1, mb: 2,
            boxShadow: 'none',
          }),
          ...(ownerState.variant === 'hero' && {
            border: '3px solid',
            borderColor: grey[300],
            borderRadius: 3,
            px: 2.5, py: 5,
            mt: 1, mb: 2,
            boxShadow: 'none',
          }),
          ...(ownerState.watermark === 'true' && {
            position: 'relative',
            overflow: 'hidden',
            maxWidth: { xs: '100%', md: '60%' },
            mx: 'auto',
          }),
          ...(ownerState.variant === 'avatar' && {
            border: '2px solid',
            borderColor: 'primary.light',
            borderRadius: 2,
            p: 1, m: 1,
            boxShadow: 'none',
          }),
          ...(ownerState.color === 'primary' && {
            borderColor: 'primary.light',
          }),
          ...(ownerState.color === 'secondary' && {
            borderColor: 'secondary.light',
          }),
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          // console.log({ theme });
          return {
            ...(ownerState.variant === 'music' && {
              border: '2px solid',
              borderColor: grey[300],
              borderRadius: 16,
              transition: '0.4s',
              boxShadow: 'none',
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }),
          };
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: props => ({
          ...(props?.ownerState?.variant === 'track' && {
            width: 160,
            height: 160,
            marginRight: props.theme.spacing(1.5),
            border: '1px solid',
            borderColor: grey[300],
            borderRadius: props.theme.shape.borderRadius,
          }),
        }),
      },
    },
  },
};

export default responsiveFontSizes(createTheme(themeOptions));
