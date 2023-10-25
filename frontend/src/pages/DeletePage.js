import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';
import useGamesStore from "../store/gamesStore";
import ModelImage from '../components/ModelImage';
import useDeleteGame from '../hook/useDeleteGame';
import useDeleteModel from '../hook/useDeleteModel';
import ModelsOverview from '../components/ModelsOverview';
import GamesOverview from '../components/GamesOverview';


const DeletePage = () => {

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedModelImg, setSelectedModelImg] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const ownGames = useGamesStore((state) => state.ownGames);
    const { setOwnGames } = useGamesStore();
    const { handleDeleteGame, error } = useDeleteGame();
    const { handleDeleteModel, isDeleting, error_m } = useDeleteModel();

    const updateSelectedModel = (newValue) => {
        setSelectedGame('')
        setSelectedModel(newValue);
      };
    const updateSelectedGame = (newValue) => {
        setSelectedModel('')
        setSelectedGame(newValue);
      };

    const handelDelete = async (e) => {
        e.preventDefault();
        if (selectedGame) {
            try {
                const response = await handleDeleteGame(selectedGame)
                const newOwn = ownGames.filter(game => game.id !== selectedGame)
                setOwnGames(newOwn);
                setSelectedGame('')
            } catch (error) {
                console.error('Axios error:', error);
            }
        } else if (selectedModel) {
            try {
                const response = await handleDeleteModel(selectedModel)
                const newOwn = ownGames.filter(game => game.modelId !== selectedModel)
                setOwnGames(newOwn);
                setSelectedModel('')
            } catch (error) {
                console.error('Axios error:', error);
            }
        }
        setSelectedModelImg('')

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


    return (
        <>
            <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={5}>
                    <Typography variant="h5">Choose model to delete</Typography>
                    <ModelsOverview updateSelectedModel={updateSelectedModel} selectedModel={selectedModel} />

                    <Typography variant="h5" style={{marginTop: '10px'}}>Choose game to delete</Typography>
                    <GamesOverview updateSelectedGame={updateSelectedGame} games={ownGames} selectedGame={selectedGame} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Preview Model Under Test</Typography>
                    {selectedModelImg ? (
                        <ModelImage modelId={selectedModelImg} />
                    ) : <Box style={{ height: '33vh', display: 'flex', justifyContent: 'center', marginTop: '40px' }}></Box>}
                    <Box style={{ marginTop: '160px' }}>
                        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ width: '85%', marginTop: '48px' }}
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