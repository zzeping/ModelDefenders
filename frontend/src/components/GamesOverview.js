import React from 'react';
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, Typography, TableBody, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ModelInfo from './ModelInfo';
import UserInfo from './UserInfo';

const GamesOverview = ({ games, updateSelectedGame, selectedGame }) => {


    const handleGameSelectChange = (event) => {
        updateSelectedGame(event.target.value);
    };


    return (
        <>
            <Typography variant="body1" style={{ background: "#eeeeee", textAlign: 'center', borderRadius: '4px', marginTop: '3px' }}>
                Games overview
            </Typography>
            <Paper style={{ height: '30vh', overflowY: 'auto', width: '100%' }} >
                <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>

                    <Table size="small">
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
                            {games && games.map((game) => (
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
        </>
    )


}

export default GamesOverview;