import React from "react";
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import ModelsOverviewPane from "./ModelsOverviewPane";


function ModelsOverview() {

      return (
        <Grid container spacing={2} flexDirection='row' padding={2} justifyContent="flex-start">
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography variant="h4">
              Create a new game
            </Typography>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center">
           <ModelsOverviewPane />
          </Grid> 
        </Grid>
      )
}

export default ModelsOverview;