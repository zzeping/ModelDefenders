import React, { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem, Button, Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAddGame from '../hook/useAddGame';
import useAuthStore from '../store/authStore';
import CreateModel from '../components/CreateModel';
import ModelsOverview from '../components/ModelsOverview';
import ModelImage from '../components/ModelImage';

const CreateGame = () => {
    const { handleAddGame, isAdding, error } = useAddGame();
    const [selectedModel, setSelectedModel] = useState('');
    const [notation, setNotation] = useState('MERODE');
    const [role, setRole] = useState('');
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const handleAdd = async (e) => {
        let attackerId = null;
        let defenderId = null;
        if (role === 'Attacker') {
            attackerId = user.id;
        } else if (role === 'Defender') {
            defenderId = user.id;
        }

        console.log({
            modelId: selectedModel,
            ownerId: user.id,
            notation,
            attackerId,
            defenderId,
        })
        try {
            const newGame = await handleAddGame({
                modelId: selectedModel,
                ownerId: user.id,
                notation,
                attackerId,
                defenderId,
            })
            navigate('/')
        } catch (error) {
            alert('Unable to add the Game.');
        }
    }

    const updateSelectedModel = (newValue) => {
        setSelectedModel(newValue);
    }

    const handleNotationChange = (event) => {
        setNotation(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={5}>
                <Typography variant="h5">Create a new game</Typography>
                <ModelsOverview updateSelectedModel={updateSelectedModel} selectedModel={selectedModel} />
                <CreateModel />
                <Box style={{ marginTop: '122px' }}>
                    <Typography variant="h5">Game settings</Typography>
                    <FormControl sx={{ m: 1, minWidth: 120 }} style={{ marginLeft: '30px' }} size="small">
                        <InputLabel htmlFor="notation">Notation</InputLabel>
                        <Select
                            id="notation"
                            value={notation}
                            label="notation"
                            onChange={handleNotationChange}
                        >
                            <MenuItem value={'MERODE'}>MERODE</MenuItem>
                            <MenuItem value={'UML'}>UML</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} style={{ marginLeft: '30px' }} size="small">
                        <InputLabel htmlFor="role">Role</InputLabel>
                        <Select
                            id="role"
                            value={role}
                            label="role"
                            onChange={handleRoleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'Attacker'}>Attacker</MenuItem>
                            <MenuItem value={'Defender'}>Defender</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5">Preview Model Under Test</Typography>
                {selectedModel ? (
                    <ModelImage modelId={selectedModel} />
                ) : <Box style={{ height: '31vh', display: 'flex', justifyContent: 'center', marginTop: '40px' }}></Box>}

                <Box style={{ marginTop: '160px' }}>
                    <Typography variant="h5">Create game</Typography>
                    <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ width: '100%' }}
                            disabled={selectedModel === ''}
                            onClick={handleAdd}
                        >{isAdding ? 'Adding...' : 'Create Game'}</Button>
                        {error && <div>Error: {error.message}</div>}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CreateGame;