import { Dialog, Button, Table, DialogTitle, TableContainer, DialogActions, TableRow, TableHead, TableBody, TableCell } from '@mui/material';
import React from 'react';

const EventsOverview = ({ EIDtoName, OIDtoName, events }) => {

    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Event name</TableCell>
                        <TableCell>Object name</TableCell>
                        <TableCell>Objetc type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(events.length !== 0) && events && events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{EIDtoName(event.eventType)}</TableCell>
                            <TableCell>{event.objName}</TableCell>
                            <TableCell>{OIDtoName(event.objType)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )

}

export default EventsOverview;