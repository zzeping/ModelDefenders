import { Table, TableRow, TableHead, TableBody, TableCell } from '@mui/material';
import React from 'react';

const EventsView = ({ events }) => {

    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Event name</TableCell>
                        <TableCell>Object name</TableCell>
                        <TableCell>Objetc type</TableCell>
                        <TableCell>Related to</TableCell>
                        <TableCell>Expected</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(events.length !== 0) && events && events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{event.eventName}</TableCell>
                            <TableCell>{event.objName}</TableCell>
                            <TableCell>{event.objTypeName}</TableCell>
                            <TableCell>{(event.relatedTo?.map((item, index) => (
                                <span key={index}>{item[Object.keys(item)[0]]}{index === Object.keys(event.relatedTo).length - 1 ? '' : ', '}</span>
                            )))}</TableCell>
                            <TableCell>{event.outCome}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )

}

export default EventsView;