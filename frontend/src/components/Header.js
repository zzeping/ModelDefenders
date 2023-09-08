import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import logo from "./logo-white.svg";
import { Button } from "@mui/material";


function Header() {
  const headerColor = "#3B8FEF";
      return (
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} flexDirection='row' backgroundColor={headerColor} padding={2} justifyContent="flex-start">
          <Grid item xs={1} display="flex">
            <img src={logo}  alt="logo"/>
          </Grid>
          <Grid item xs={10} display="flex" alignItems="center" color="white">
            <Typography variant="h3">
              ModelDefenders
            </Typography>
          </Grid>
          <Grid item xs={1} display="flex" alignItems="center" color="white">
            <Button variant="login">Login</Button>
          </Grid>
        </Grid>
        </Box>
      )
}

export default Header;
