import React, { useEffect, useState } from 'react';
import { TableContainer, Chip, Table, Button, Paper, TableHead, TableRow, TableCell, Box, Typography, TableBody, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ModelInfo from "../components/ModelInfo";
import UserInfo from "../components/UserInfo";
import useGamesStore from "../store/gamesStore";
import useUserModels from '../hook/useModels';
import ModelImage from '../components/ModelImage';
import useDeleteGame from '../hook/useDeleteGame';
import useDeleteModel from '../hook/useDeleteModel';


const DeletePage = () => {

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedModelImg, setSelectedModelImg] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const ownGames = useGamesStore((state) => state.ownGames);
    const { setOwnGames } = useGamesStore();
    const { handleDeleteGame, error } = useDeleteGame();
    const { handleDeleteModel, isDeleting, error_m } = useDeleteModel();


    const { data: models, isLoading, isError } = useUserModels();


    const handleGameSelectChange = (event) => {
        setSelectedModel('')
        setSelectedGame(event.target.value);
    };

    const handleModelSelectChange = (event) => {
        setSelectedGame('')
        setSelectedModel(event.target.value);

    };

    const handelDelete = async (e) => {
        e.preventDefault();
        if (selectedGame) {
            try {
                const response = await handleDeleteGame(selectedGame)
                const newOwn = ownGames.filter(game => game.id !== selectedGame)
                setOwnGames(newOwn);
            } catch (error) {
                console.error('Axios error:', error);
            }
        } else if (selectedModel) {
            try {
                const response = await handleDeleteModel(selectedModel)
                const newOwn = ownGames.filter(game => game.modelId !== selectedModel)                
                setOwnGames(newOwn);
            } catch (error) {
                console.error('Axios error:', error);
            }
        }

    }

    useEffect(() => {
        if (selectedModel) {
            setSelectedModelImg(selectedModel)
        }
        if (ownGames && selectedGame) {
            const game = ownGames.find(game => game.id === selectedGame);
            setSelectedModelImg(game.modelId)
        }
    }, [selectedModel, selectedGame])

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p>Error loading games.</p>;
    }

    return (
        <>
            <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={5}>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>
                        Models overview
                    </Typography>
                    <Paper style={{ height: '30vh', overflowY: 'auto', width: '100%' }} >
                        <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>

                            <Table sx={{ maxWidth: 550 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Select</TableCell>
                                        <TableCell>Model name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Difficulty</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {models && models.map((model) => (
                                        <TableRow key={model.id}>
                                            <TableCell>
                                                <RadioGroup
                                                    value={selectedModel}
                                                    onChange={handleModelSelectChange}>
                                                    <FormControlLabel
                                                        value={model.id}
                                                        control={<Radio />} />
                                                </RadioGroup>
                                            </TableCell>
                                            <TableCell>{model.name}</TableCell>
                                            <TableCell>{model.type}</TableCell>
                                            <TableCell><Chip label={model.difficulty}
                                                style={{
                                                    backgroundColor:
                                                        model.difficulty === 'Easy'
                                                            ? 'green'
                                                            : model.difficulty === 'Intermediate'
                                                                ? 'orange'
                                                                : model.difficulty === 'Advanced'
                                                                    ? 'red'
                                                                    : 'gray',
                                                    color: 'white',
                                                }} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>
                        Games overview
                    </Typography>
                    <Paper style={{ height: '30vh', overflowY: 'auto', width: '100%' }} >
                        <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>

                            <Table sx={{ maxWidth: 550 }} size="small">
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
                                    {ownGames.map((game) => (
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
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Preview Model Under Test</Typography>
                    <Box style={{ height: '39vh', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        {selectedModelImg && (
                            <ModelImage modelId={selectedModelImg} />
                        )}
                    </Box >
                    <Box style={{ marginTop: '140px' }}>
                        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ width: '85%' }}
                                disabled={selectedModel === '' && selectedGame === ''}
                                onClick={handelDelete}
                            >{isDeleting ? 'Deleting...' : 'Delete'}</Button>
                            
                        </Box>
                        {error && <div>Error: {error.message}</div>}
                        {error_m && <div>Error: {error_m.message}</div>}
                    </Box>
                </Grid>
            </Grid>


        </>);
}


export default DeletePage;