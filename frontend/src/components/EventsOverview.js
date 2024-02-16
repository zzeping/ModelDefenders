import { Dialog, Button, Table, DialogTitle, TableContainer, DialogActions, MenuItem, TableRow, TableHead, TableBody, TableCell, Select } from '@mui/material';
import React from 'react';

const EventsOverview = ({ EIDtoName, OIDtoName, events }) => {

    const menuItemStyle = {
        fontSize: '14px',
        height: '20px',
    };

    const selectStyle = {
        background: "green",
        fontSize: '14px',
        color: 'white',
        height: '20px',
        marginLeft: '5px',
    };

    const handleOutComeChange = (id, outCome) => {
        const selectStyle = {
            background: (outCome === "Success" ? "green" : "red"),
            fontSize: '14px',
            color: 'white',
            height: '20px',
            marginLeft: '5px',
        };


    }

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
                            <TableCell>{EIDtoName(event.eventId)}</TableCell>
                            <TableCell>{event.objName}</TableCell>
                            <TableCell>{OIDtoName(event.objType)}</TableCell>
                            <TableCell>{event.relatedTo.map((item, index) => (
                                <span key={index}>{item[Object.keys(item)[0]]}{index === Object.keys(event.relatedTo).length - 1 ? '' : ', '}</span>
                            ))}</TableCell>
                            <TableCell>
                                <Select size="small" value={event.outCome} style={selectStyle} onChange={(e) => handleOutComeChange(event.id, e.target.value)}>
                                    <MenuItem style={menuItemStyle} value="Success">Success</MenuItem>
                                    <MenuItem style={menuItemStyle} value="Fail">Fail</MenuItem>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )

}

export default EventsOverview;