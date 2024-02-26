import { Table, MenuItem, TableRow, TableHead, TableBody, TableCell, Select, IconButton, ListItemText, ListItem } from '@mui/material';
import React, { useState } from 'react';
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const EventsOverview = ({ events, setEvents, dependencyTypes, objects }) => {

    const [masters, setMasters] = useState([]); //matsers for dependent objects
    const [chosenMasters, setChosenMasters] = useState({}); //store the chosen masters when creating an object


    const onStartEdit = (id) => {
        // prepare masters -- the masters that the independent can choose from
        const eventToUpdate = events.find(ev => (ev.id === id));
        dependencyTypes.forEach((dependency) => {
            if (dependency.dependent === eventToUpdate.objType) {
                setMasters((prevMasters) => [...prevMasters, {
                    name: dependency.name.master,
                    id: dependency.master,
                    objs: objects.filter((obj) => obj.objType === dependency.master),
                }])
            }
        });

        // display the current chosen masters
        const newChosenMasters = {};
        eventToUpdate.relatedTo.forEach((item) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            newChosenMasters[key] = value;
        });
        setChosenMasters(newChosenMasters);

        // make the row editable
        setEvents(state => {
            return events.map(e => {
                if (e.id === id) {
                    return { ...e, isEditMode: true };
                }
                return e;
            });
        });
    }

    const onSaveEdit = (id) => {
        // save the change of relatedTo
        setEvents((prevEvents) =>
            prevEvents.map((e) => {
                if (e.id === id) {
                    const updatedRelatedTo = Object.entries(chosenMasters).map(([key, value]) => ({
                        [key]: value,
                    }));
                    return { ...e, isEditMode: false, relatedTo: updatedRelatedTo };
                }
                return e;
            })
        );
        setChosenMasters([])
        setMasters([])
    }

    const onChange = (e, event) => {
        const value = e.target.value;
        const name = e.target.name;
        const { id } = event;
        const newEvents = events.map(ev => {
            if (ev.id === id) {
                return { ...ev, [name]: value };
            }
            return ev;
        });
        setEvents(newEvents);
    };

    const onDelete = (id) => {
        const updatedEvents = events.filter((e) => e.id !== id);
        setEvents(updatedEvents);
    };

    const handleChooseMaster = (name, value) => {
        setChosenMasters((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
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
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(events.length !== 0) && events && events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{event.eventName}</TableCell>
                            <TableCell>{event.objName}</TableCell>
                            <TableCell>{event.objTypeName}</TableCell>
                            <TableCell>{(event.isEditMode && event.eventType === "CREATE") ? (<>
                                {masters && masters.map((master, index) => (
                                    <ListItem style={{ paddingTop: '0px', paddingBottom: '2px', marginTop: '0px' }} key={index}><ListItemText primary={master.name} />
                                        <Select
                                            style={{ fontSize: '14px', height: '20px', }}
                                            size="small"
                                            value={chosenMasters[master.name] || ''}
                                            onChange={(e) => handleChooseMaster(master.name, e.target.value)}
                                        >
                                            <MenuItem value="">(none)</MenuItem>
                                            {master.objs && (master.objs.length !== 0) && master.objs.map((obj, objIndex) => (
                                                <MenuItem style={{ fontSize: '14px', height: '20px', }} key={objIndex} value={obj?.objName || ''}>
                                                    {obj?.objName || ''}
                                                </MenuItem>
                                            ))}
                                        </Select> </ListItem>
                                ))}
                            </>) : (event.relatedTo.map((item, index) => (
                                <span key={index}>{item[Object.keys(item)[0]]}{index === Object.keys(event.relatedTo).length - 1 ? '' : ', '}</span>
                            )))}</TableCell>
                            <TableCell>{event.isEditMode ? (<Select
                                value={event.outCome}
                                onChange={(e) => onChange(e, event)}
                                name='outCome'
                            >
                                <MenuItem value="Success">Success</MenuItem>
                                <MenuItem value="Fail">Fail</MenuItem>
                            </Select>) : (event.outCome)}</TableCell>
                            <TableCell>
                                {event.isEditMode ? (
                                    <>
                                        <IconButton onClick={() => onSaveEdit(event.id)}><SaveIcon /></IconButton>
                                        {/* <IconButton onClick={() => onRevert(event.id)}><CloseIcon /></IconButton> */}
                                    </>
                                ) : (
                                    <>
                                        <IconButton onClick={() => onStartEdit(event.id)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => onDelete(event.id)}><DeleteForeverOutlinedIcon /></IconButton>
                                    </>

                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )

}

export default EventsOverview;