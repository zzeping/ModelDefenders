import React, { useState, useEffect } from 'react';
import { TableContainer, Table, Button, Paper, TableHead, TableRow, TableCell, Box, Typography, TableBody, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ModelInfo from './ModelInfo';
import UserInfo from './UserInfo';
import useGames from '../hook/useGames'


const AvailableGames = () => {
  const { data: availableGames, isLoading, isError } = useGames();
  const [selectedGame, setSelectedGame] = useState('');
  const [modelImage, setModelImage] = useState(null);

  const handleGameSelectChange = (event) => {
    setSelectedGame(event.target.value);
  };

  const changeImage = (img) => {
    setModelImage(img)
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error loading games.</p>;
  }

  return (
    <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid item xs={5}>
        <Typography variant="h5">Active games</Typography>
        <Typography variant="h6" style={{ textAlign: 'center' }}>
          Games overview
        </Typography>
        <Paper style={{ height: '40vh', overflowY: 'auto', width: '100%' }} >
          <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>

            <Table sx={{ maxWidth: 550 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Model name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Creator</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      <RadioGroup
                        value={selectedGame}
                        onChange={handleGameSelectChange}>
                        <FormControlLabel
                          value={game.id}
                          control={<Radio />} />
                      </RadioGroup>
                    </TableCell>
                    <ModelInfo gameId={game.id} modelId={game.modelId} selectedGame={selectedGame} changeImage={changeImage} />
                    <UserInfo userId={game.ownerId} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>
        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Button
            color="primary"
            variant="contained"
            style={{ width: '100%' }}
            disabled={selectedGame === ''}
          >
            Join selected game
          </Button>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Preview Model Under Test</Typography>
        <Box style={{ height: '42vh', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          {modelImage && (
            <img src={`/image/${modelImage}`} alt="Model" />

          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default AvailableGames;
