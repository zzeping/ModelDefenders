import React, { useEffect, useState } from 'react';
import { TableContainer, Chip, Table, InputLabel, FormControl, Select, MenuItem, Button, Paper, TableHead, TableRow, TableCell, Box, Typography, TableBody, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import useModels from '../hook/useModels';
import { useNavigate } from 'react-router-dom';
import useAddGame from '../hook/useAddGame';
import useAuthStore from '../store/authStore';
import CreateModel from '../components/CreateModel';

const CreateGame = () => {
    const { data: models, isLoading, isError } = useModels();
    const { handleAddGame, isAdding, error } = useAddGame();
    const [selectedModel, setSelectedModel] = useState('');
    const [modelImage, setModelImage] = useState(null);
    const [notation, setNotation] = useState('MERODE');
    const [role, setRole] = useState('');
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const handleAdd = async (e) => {
        e.preventDefault();

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


    useEffect(() => {
        if (models && selectedModel) {
            const model = models.find(model => model.id === selectedModel);
            setModelImage(model.image)
        }
    }, [selectedModel])

    const handleModelSelectChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const handleNotationChange = (event) => {
        setNotation(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p>Error loading games.</p>;
    }

    return (
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={5}>
                <Typography variant="h5">Create a new game</Typography>
                <Typography variant="h6" style={{ textAlign: 'center' }}>
                    Models overview
                </Typography>
                <Paper style={{ height: '40vh', overflowY: 'auto', width: '100%' }} >
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
                <Box style={{ height: '39vh', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    {modelImage && (
                        <img src={`/image/${modelImage}`} alt="Model" />

                    )}
                </Box >
                <Box style={{ marginTop: '153px' }}>
                    <Typography variant="h5">Start game</Typography>
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