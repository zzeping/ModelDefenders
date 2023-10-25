import React from 'react';
import { TableContainer, Table, Paper, Chip, TableHead, TableRow, TableCell, Typography, TableBody, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import useUserModels from '../hook/useModels';

const ModelsOverview = ({ updateSelectedModel, selectedModel }) => {

    const { data: models, isLoading, isError } = useUserModels();

    const handleModelSelectChange = (event) => {
        updateSelectedModel(event.target.value);
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p>Error loading models.</p>;
    }

    return (
        <>
            <Typography variant="body1" style={{ background: "#eeeeee", textAlign: 'center', borderRadius: '4px' }}>
                Models overview
            </Typography>
            <Paper style={{ height: '30vh', overflowY: 'auto', width: '100%' }} >
                <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>

                    <Table size="small">
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
        </>
    )


}

export default ModelsOverview;