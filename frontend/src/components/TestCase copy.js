import { TableContainer, Button, IconButton, Paper, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddEvent from './AddEvent';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import CreateObject from './CreateObject';
import ChangeObject from './ChangeObject';
import EventsOverview from './EventsOverview';
import useAddTestCase from '../hook/useAddTestCase';
import useAuthStore from '../store/authStore';



const TestCase = () => {

    const modelId = useBattleFieldStore((state) => state.modelId);
    const { handleAddTestCase, isAdding, error } = useAddTestCase();
    const { data: model } = useModel(modelId); // get the model data of the current game
    const user = useAuthStore((state) => state.user);
    const gameId = useBattleFieldStore((state) => state.gameId);

    const [open, setOpen] = useState(false); // add event dialog 
    const [open_att, setOpenAtt] = useState(false); // add attributes dialog
    const [open_change, setOpenChange] = useState(false); // the dialog of ending or modifying an object
    const [attributes, setAttributes] = useState([]); // attributes array for each object
    const [masters, setMasters] = useState([]); //matsers for dependent objects
    const [avaObjs, setAvaObjs] = useState([]); // the objects that can be ended or be modified. 
    const [eventid, seteventid] = useState(0);

    // data of the model reading from mxp file
    const eventTypes = model.content.metamodel.eventTypes
    const methods = model.content.metamodel.methods
    const objectTypes = model.content.metamodel.objectTypes
    const dependencyTypes = model.content.metamodel.dependencies
    const ownedMethods = methods.filter((method) => method.provenance === 'OWNED');
    const updatedEventTypes = eventTypes.map((eventType) => {
        const matchingMethod = ownedMethods.find((method) => method.ownerEventType === eventType.id);
        const matchingObj = objectTypes.find((obj) => obj.id === matchingMethod.ownerObjectType);
        return {
            ...eventType,
            methodType: matchingMethod ? matchingMethod.type : null,
            objType: matchingMethod ? matchingMethod.ownerObjectType : null,
            objName: matchingObj ? matchingObj.name : null,
        };
    });

    const [objects, setObjects] = useState([]);  // objName, objTypeID
    const [events, setEvents] = useState([]);  // eventID, eventTypeID, objType, objID

    const [objectType, setObjectType] = useState(''); // indicate the objectTpye id when creating an object
    const [eventType, setEventType] = useState('');

    const [inputValues, setInputValues] = useState({}); //store the input attributes when creating an object 
    const [chosenMasters, setChosenMasters] = useState({}); //store the chosen masters when creating an object

    // after clicking the add button of an event
    const handleAddEvent = (e) => {
        const method = ownedMethods.find((method) => method.ownerEventType === e.target.value)
        const matching_obj = objectTypes.find((obj) => obj.id === method.ownerObjectType);
        setEventType(updatedEventTypes.find((evType) => evType.id === e.target.value));
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
            setOpenAtt(true)

        } else if (method.type === 'END') {
            setObjectType(method.ownerObjectType)
            setAvaObjs(objects.filter((obj) => {
                if (obj.objType === method.ownerObjectType) {
                    return true
                }
                return false;
            }))
            setOpenChange(true)
        } else {
            setObjectType(method.ownerObjectType)
            setAvaObjs(objects.filter((obj) => obj.objType === method.ownerObjectType))
            setOpenChange(true)
        }
    }

    // after clicking submit button and create an object
    const handleSubmit = () => {
        seteventid(eventid + 1)
        const newName = inputValues['name'] || '';
        const objectExists = objects.some((obj) => obj.objType === objectType && obj.objName === newName);
        if (!objectExists && newName !== '') {
            const newObj = {
                objType: objectType,
                objName: newName,
            };
            let relatedTo = [];
            for (const key in chosenMasters) {
                relatedTo.push({ [key]: chosenMasters[key] })
            }

            const newEvent = {
                id: eventid,
                eventId: eventType.id,
                eventName: eventType.name,
                eventType: eventType.methodType,
                objType: eventType.objType,
                objTypeName: eventType.objName,
                objName: inputValues['name'] || '',
                relatedTo: relatedTo,
                outCome: "Success",
                isEditMode: false,
            };
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

    // adding event when ending or modifying an object 
    const handleObj = (e) => {

        const newEvent = {
            id: eventid,
            eventId: eventType.id,
            eventName: eventType.name,
            eventType: eventType.methodType,
            objType: eventType.objType,
            objTypeName: eventType.objName,
            objName: e.target.value,
            relatedTo: [],
            outCome: "Success",
            isEditMode: false,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent])
        seteventid(eventid + 1)
        handleClose();
    }

    // close the add event, add attributes, and end/modify dialog  
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


    const handleDefend = async () => {

        console.log(events)
        console.log({
            events,
            userId: user.id,
            gameId,
        })
        try {
            const newTestCase = await handleAddTestCase({
                events,
                userId: user.id,
                gameId
            })
            setEvents([]);
            seteventid(0);
            setObjects([])
        } catch (err) {
            alert(err.response.data.message);
        }

    }

    return (
        <>
            <Paper>
                <Box style={{ height: '29vh', overflowY: 'auto', width: '100%' }}>
                    <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>
                        <EventsOverview events={events} setEvents={setEvents} setObjects={setObjects} dependencyTypes={dependencyTypes} objects={objects} />
                    </TableContainer>
                    {(events.length === 0) && events && <Typography style={{ marginLeft: '20px' }}>No events added yet.</Typography>}

                    <Box style={{ display: 'flex', justifyContent: 'center' }} >
                        <IconButton onClick={() => setOpen(true)}><AddCircleIcon color='primary' /></IconButton>
                    </Box>
                    <AddEvent events={eventTypes} setOpen={setOpen} open={open} handleAddEvent={handleAddEvent} />
                    <CreateObject chosenMasters={chosenMasters} setChosenMasters={setChosenMasters} inputValues={inputValues} setInputValues={setInputValues} handleClose={handleClose} handleSubmit={handleSubmit} attributes={attributes} masters={masters} open={open_att} />
                    <ChangeObject objs={avaObjs} open={open_change} handleObj={handleObj} handleClose={handleClose} />

                </Box>
                <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0', width: '99.3%', borderRadius: '4px', background: "#eeeeee", padding: '3px' }}>
                    <Typography variant="body2" style={{ marginRight: '5px' }}>Event count: {events.length}</Typography>
                    {/* <Button onClick={() => { setEvents([]); setObjects([]); }} style={{ marginLeft: '20px', height: '20px', fontSize: '10px', padding: '5px', color: 'red' }}>Clear events</Button> */}
                </Box>
            </Paper>

            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '46px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    style={{ width: '100%' }}
                    disabled={events.length === 0}
                    onClick={handleDefend}
                >Defend</Button>
            </Box>

        </>
    )

}

export default TestCase;