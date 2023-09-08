import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import ModelsOverview from "./ModelsOverview";

function Body() {

      return (
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} flexDirection='row' padding={2} justifyContent="flex-start">
          <Grid item xs={6} display="flex">
            <ModelsOverview/>
          </Grid>
          <Grid item xs={6} display="flex" alignItems="center">
            <Typography variant="h3">
              ModelDefenders
            </Typography>
          </Grid>
          <Grid item xs={6} display="flex" alignItems="center">
          <Typography variant="h3">
              ModelDefenders
            </Typography>
          </Grid>
          <Grid item xs={6} display="flex" alignItems="center">
          <Typography variant="h3">
              ModelDefenders
            </Typography>
          </Grid>
        </Grid>
        </Box>
      )
}

export default Body;
