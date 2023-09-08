import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
      MuiButton: {
        variants: [
          {
            props: { variant: 'login' },
            style: {
              textTransform: 'none',
              border: `2px solid`,
            },
          },
        ],
      },
    },
  });

  export default theme;