import { TableContainer, Table, Button, Select, MenuItem, IconButton, Paper, TableHead, TableRow, TableCell, Box, Typography, TableBody } from '@mui/material';
import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddEvent from './AddEvent';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import CreateObject from './CreateObject';
import ChangeObject from './ChangeObject';

const TestCase = () => {

    const modelId = useBattleFieldStore((state) => state.modelId);

    const { data: model } = useModel(modelId); // get the model data of the current game

    const [open, setOpen] = useState(false); // add event dialog 
    const [open_att, setOpenAtt] = useState(false); // add attributes dialog
    const [open_change, setOpenChange] = useState(false);
    const [end, setEnd] = useState(false)
    const [attributes, setAttributes] = useState([]); // attributes array for each object
    const [masters, setMasters] = useState([]); //matsers for dependent objects
    const [avaObjs, setAvaObjs] = useState([]);

    const eventTypes = model.content.metamodel.eventTypes
    const methods = model.content.metamodel.methods
    const objectTypes = model.content.metamodel.objectTypes
    const dependencyTypes = model.content.metamodel.dependencies
    const ownedMethods = methods.filter((method) => method.provenance === 'OWNED');

    const [objects, setObjects] = useState([]);  // objName, objTypeID
    const [events, setEvents] = useState([]);  // eventID, eventTypeID, objType, objID
    const [dependencies, setDependencies] = useState([]); // masterName, dependentName, dependencyType

    const [objectType, setObjectType] = useState('');
    const [eventType, setEventType] = useState('');

    const [inputValues, setInputValues] = useState({});
    const [chosenMasters, setChosenMasters] = useState({});

    const [expected, setExpected] = useState('Success');




    // console.log(model.content)

    const handleAddEvent = (e) => {
        const method = ownedMethods.find((method) => method.ownerEventType === e.target.value)
        const matching_obj = objectTypes.find((obj) => obj.id === method.ownerObjectType);
        if (method.type === 'CREATE') {
            dependencyTypes.forEach((dependency) => {
                if (dependency.dependent === matching_obj.id) {
                    setMasters((prevMasters) => [...prevMasters, {
                        name: dependency.name.master,
                        id: dependency.master,
                        objs: objects.filter((obj) => obj.objType === dependency.master),
                    }])
                }
            });
            setAttributes(matching_obj.attributes)
            setObjectType(method.ownerObjectType)
            setEventType(method.ownerEventType)
            setOpenAtt(true)
        } else if (method.type === 'END') {
            setObjectType(method.ownerObjectType)
            setEventType(method.ownerEventType)
            setAvaObjs(objects.filter((obj) => obj.objType === method.ownerObjectType))
            setOpenChange(true)
            setEnd(true)
        } else {
            setObjectType(method.ownerObjectType)
            setEventType(method.ownerEventType)
            setAvaObjs(objects.filter((obj) => obj.objType === method.ownerObjectType))
            setOpenChange(true)
        }

    }

    // console.log(dependencies)




    const selectStyle = {
        background: (expected==="Success"?"green":"red"),
        fontSize: '14px', 
        color: 'white',
        height: '20px',
        marginLeft: '5px',
    };

    const menuItemStyle = {
        fontSize: '14px',
        height: '20px',
    };

    const handleSubmit = () => {

        const newName = inputValues['name'] || '';
        const objectExists = objects.some((obj) => obj.objType === objectType && obj.objName === newName);
        if (!objectExists && newName !== '') {
            const newObj = {
                objType: objectType,
                objName: newName,
            };
            const newEvent = {
                id: events.length,
                eventType: eventType,
                objType: objectType,
                objName: inputValues['name'] || '',
            };

            for (const key in chosenMasters) {
                const newDependency = {
                    master: chosenMasters[key],
                    dependent: newName,
                    dependencyType: dependencyTypes.find((dependencyType) => dependencyType.master === objects.find((obj) => obj.objName === chosenMasters[key]).objType && dependencyType.dependent === objectType)
                }
                setDependencies((pre) => [...pre, newDependency])
            }

            setObjects((prevObjs) => [...prevObjs, newObj])
            setEvents((prevEvents) => [...prevEvents, newEvent])
            handleClose();
        } else if (newName === '') {
            alert("Please input a name.")
        } else {
            alert("The object exists. Please change a name.")
            setInputValues({})
        }
    }
    const handleObj = (e) => {

        const newEvent = {
            id: events.length,
            eventType: eventType,
            objType: objectType,
            objName: e.target.value,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent])
        if (end) {
            setObjects(objects.filter((obj) => obj.objName !== e.target.value || obj.objType !== objectType))
            setEnd(false)
        }

        handleClose();
    }

    const handleClose = () => {
        setAvaObjs([])
        setEventType('')
        setObjectType('')
        setAttributes([])
        setInputValues({})
        setMasters([])
        setChosenMasters({})
        setOpenAtt(false)
        setOpenChange(false)
        setOpen(false)
    }

    const OIDtoName = (id) => {
        const matching_obj = objectTypes.find((type) => type.id === id)
        return matching_obj.name
    }
    const EIDtoName = (id) => {
        const matching_eve = eventTypes.find((type) => type.id === id)
        return matching_eve.name
    }

    return (
        <>
            <Paper>
                <Box style={{ height: '23vh', overflowY: 'auto', width: '100%'}}>
                    <TableContainer style={{ display: 'flex', justifyContent: 'center' }}><Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Event name</TableCell>
                                <TableCell>Object name</TableCell>
                                <TableCell>Object type</TableCell>
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
                    </TableContainer>
                    {(events.length === 0) && events && <Typography style={{ marginLeft: '20px' }}>No events added yet.</Typography>}

                    <Box style={{ display: 'flex', justifyContent: 'center' }} >
                        <IconButton onClick={() => setOpen(true)}><AddCircleIcon color='primary' /></IconButton>
                    </Box>
                    <AddEvent events={eventTypes} setOpen={setOpen} open={open} handleAddEvent={handleAddEvent} />
                    <CreateObject chosenMasters={chosenMasters} setChosenMasters={setChosenMasters} inputValues={inputValues} setInputValues={setInputValues} handleClose={handleClose} handleSubmit={handleSubmit} attributes={attributes} masters={masters} open={open_att} />
                    <ChangeObject objs={avaObjs} open={open_change} handleObj={handleObj} handleClose={handleClose} />

                </Box>
                <Box style={{ display: 'flex', marginTop: '0', width: '99.3%', borderRadius: '4px', background: "#eeeeee", padding: '3px'}}>
                    <Typography variant="body2" style={{ marginLeft: '20px' }}>Expected outcome:</Typography>
                    <Select size="small" value={expected} style={selectStyle} onChange={(e)=>setExpected(e.target.value)}>
                        <MenuItem style={menuItemStyle} value="Success">Sucess</MenuItem>
                        <MenuItem style={menuItemStyle} value="Fail">Fail</MenuItem>
                    </Select>
                    <Typography variant="body2" style={{ marginLeft: '20px' }}>Event count: {events.length}</Typography>                    
                    <Button onClick={()=>{setEvents([]);setObjects([]);setDependencies([]);}} style={{ marginLeft: '20px', height: '20px',fontSize: '10px', padding:'5px', color:'red' }}>Clear events</Button>
                    <Button disabled={events.length===0} variant="contained" style={{ marginRight: '20px', height: '20px',marginLeft: 'auto',fontSize: '10px', padding:'5px' }}>Add test case</Button>
                </Box>
            </Paper>

            <Typography variant="body2" style={{ background: "#eeeeee", borderRadius: '4px', paddingLeft: '10px', marginTop: '10px' }}>Test cases in current test suite</Typography>
            <Paper style={{ height: '7vh', overflowY: 'auto', width: '100%' }} ></Paper>
            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    style={{ width: '100%' }}
                    disabled={true}
                >Defend</Button>
            </Box>

        </>
    )

}

export default TestCase;