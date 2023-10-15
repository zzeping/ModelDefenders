import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { TableContainer, Table, Button, Paper, Link, TableHead, TableRow, TableCell, Box, Typography, TableBody, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ModelInfo from '../components/ModelInfo';
import UserInfo from '../components/UserInfo';
import useAvailableGames from '../hook/useGames'
import useUserGames from '../hook/useUserGames';
import ModelImage from '../components/ModelImage';
import useAuthStore from '../store/authStore';
import useJoinGame from '../hook/useJoinGame';

const HomePage = () => {
    // request the user's joined games, user's joinable games from the backend.
    const { data: availableGames, isLoading, isError } = useAvailableGames();
    const { data: userGames, isLoading_u, isError_u } = useUserGames();

    // user can select game to view the image of selected game's model
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const handleGameSelectChange = (event) => {
        setSelectedGame(event.target.value);
    };

    const user = useAuthStore((state) => state.user);
    const {handleJoinGame, isJoining, error_j} = useJoinGame();

    const [disble, setDisble] = useState(true);

    const handleJoinAtt = async (id) => {
        const formData = new FormData();
        formData.append('role', "attacker");
        formData.append('userId', user.id);
        formData.append('gameId', id);
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        try {
            const response = await handleJoinGame(formData)
        } catch (error) {
            console.error('Axios error:', error);
        }
    }
    const handleJoinDefen = async (id) => {
        const formData = new FormData();
        formData.append('role', 'defender');
        formData.append('userId', user.id);
        formData.append('gameId', id);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        try {
            const response = await handleJoinGame(formData)
        } catch (error) {
            console.error('Axios error:', error);
        }
    }

    const navigate = useNavigate();

    // after each selection, the program will find the modelId of the selected game in order to view the image
    useEffect(() => {
        if (availableGames && userGames && selectedGame) {
            const game = userGames.concat(availableGames).find(game => game.id === selectedGame);
            setSelectedModel(game.modelId)
            if (game.defenderId && game.attackerId) setDisble(false);
            else setDisble(true)
        }
    }, [selectedGame, availableGames, userGames])


    if (isLoading_u) {
        return <p>Loading...</p>;
    }
    if (isError_u) {
        return <p>Error loading games.</p>;
    }
    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p>Error loading games.</p>;
    }



    return (
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={6}>
                <Typography variant="h5">My active games</Typography>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                    Games overview
                </Typography>
                <Paper style={{ height: '28vh', overflowY: 'auto', width: '100%' }} >
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
                                {userGames && userGames.map((game) => (
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
                <Typography style={{ marginTop: '30px' }} variant="h5">Active open games</Typography>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                    Games overview
                </Typography>
                <Paper style={{ height: '28vh', overflowY: 'auto', width: '100%' }} >
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
                                {availableGames && availableGames.map((game) => (
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
                                            <TableCell><Button onClick={() => handleJoinAtt(game.id)}>Join</Button></TableCell>
                                        )}
                                        {game.defenderId !== null ? (
                                            <UserInfo userId={game.defenderId} />
                                        ) : (
                                            <TableCell><Button onClick={() => handleJoinDefen(game.id)}>Join</Button></TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5">Preview Model Under Test</Typography>
                <Box style={{ height: '33vh', display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
                    {selectedModel && (
                        <ModelImage modelId={selectedModel} />
                    )}
                </Box>
                <Typography style={{ marginTop: '100px' }} variant="h5">Join or continue selected game:</Typography>
                <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '17px' }}>
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ width: '100%' }}
                        disabled={disble}
                    >TO THE BATTLEFIELD</Button>
                </Box>
                <Link component="button" variant="h6" underline="hover" onClick={() => navigate('/create')} >Create new game</Link>
            </Grid>
        </Grid>
    );
}


export default HomePage;