import React, {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from 'axios';

function ModelsOverviewPane() {
    const [exercises, setExercises] = React.useState(null);
    React.useEffect(() => {
      axios.get('/exercises')
        .then(response => {
          if (!exercises) {
            setExercises(response.data);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
   
    return (
        <TableContainer component={Paper}>
            <Table  aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell align="left">Model name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Difficulty</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {!exercises ? "Loading" : exercises.map((row) => (
                    <TableRow
                    key={row.modelName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell>
                        {"selectButton"}
                    </TableCell>
                    <TableCell align="left">{row.modelName}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.difficulty}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
    );
}

export default ModelsOverviewPane;