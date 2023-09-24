import React from 'react';
import { useQuery } from 'react-query';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import useGames from '../hook/useGames';

function AvailableGames() {
  const { data: availableGames, isLoading, isError } = useGames();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading games.</p>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Game Model</TableCell>
            {/* Add more table headers as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {availableGames.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{game.id}</TableCell>
              <TableCell>{game.modelId}</TableCell>
              {/* Add more table cells for additional game properties */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AvailableGames;
