import React, { useState, useEffect } from 'react';
import { TableContainer, Table, Button, Paper, TableHead, TableRow, TableCell, Box, Typography, TableBody, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ModelInfo from './ModelInfo';
import UserInfo from './UserInfo';
import useGames from '../hook/useGames'
import useModels from '../hook/useModels';


const AvailableGames = () => {
  const { data: availableGames, isLoading, isError } = useGames();
  const { data: models } = useModels();
  const [selectedGame, setSelectedGame] = useState('');
  const [modelImage, setModelImage] = useState(null);

  const handleGameSelectChange = (event) => {
    setSelectedGame(event.target.value);
  };


  useEffect(() => {
    if (availableGames && selectedGame && models) {
      const game = availableGames.find(game => game.id === selectedGame);
      const model = models.find(model => model.id === game.modelId);
      setModelImage(model.image)
    }
  }, [selectedGame])

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error loading games.</p>;
  }

  return (
    <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid item xs={6}>
        <Typography variant="h5">Active games</Typography>
        <Typography variant="h6" style={{ textAlign: 'center' }}>
          Games overview
        </Typography>
        <Paper style={{ height: '40vh', overflowY: 'auto', width: '100%' }} >
          <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>

            <Table sx={{ maxWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Model name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Creator</TableCell>
                  <TableCell>Attacker</TableCell>
                  <TableCell>Defender</TableCell>
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
                    <ModelInfo modelId={game.modelId} />
                    <UserInfo userId={game.ownerId} />
                    {game.attackerId !== null ? (
                      <UserInfo userId={game.attackerId} />
                    ) : (
                      <TableCell>Empty</TableCell>
                    )}
                    {game.defenderId !== null ? (
                      <UserInfo userId={game.defenderId} />
                    ) : (
                      <TableCell>Empty</TableCell>
                    )}
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
