import { TableContainer, Button, IconButton, Paper, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import EventsOverview from './EventsOverview';
import CreateObject from './CreateObject';
import ChangeObject from './ChangeObject';
import AddEvent from './AddEvent';
import useAddTestCase from '../hook/useAddTestCase';
import useGameMutants from '../hook/useMutants';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import AddCircleIcon from '@mui/icons-material/AddCircle';




const TestCaseNew = () => {
    const modelId = useBattleFieldStore((state) => state.modelId);
    const { handleAddTestCase, isAdding, error } = useAddTestCase();
    const { data: mutants } = useGameMutants();
    const { data: model } = useModel(modelId); // get the model data of the current game

    const [events, setEvents] = useState([]);
    const [eventType, setEventType] = useState(''); // indicate the eventTpye id when adding an event
    const [inputValues, setInputValues] = useState({}); //store the input attributes when creating an object 
    const [chosenMasters, setChosenMasters] = useState({}); //store the chosen masters when creating an object
    const [open_att, setOpenAtt] = useState(false); // add attributes dialog
    const [open_change, setOpenChange] = useState(false); // the dialog of ending or modifying an object
    const [open, setOpen] = useState(false); // add event dialog 
    const [attributes, setAttributes] = useState([]); // attributes array for each object
    const [masters, setMasters] = useState([]); //matsers for dependent objects
    const [avaObjs, setAvaObjs] = useState([]); // the objects that can be ended or be modified. 

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

    const getAllObjetcs = () => {
        let objects = [];
        events.forEach((ev) => {
            let object = {
                name: ev.objName,
                type: ev.objType,
            }
            if (ev.eventType === "CREATE") objects.push(object)
            if (ev.eventType === "END") {
                let index = objects.findIndex(obj => obj.name === ev.objName && obj.type === ev.objType);
                if (index !== -1) {
                    objects.splice(index, 1);
                }
            }
        })
        return objects;
    }

    const getAvailableMasters = (objId) => {
        const objects = getAllObjetcs();
        
        const availableMasters = []
        dependencyTypes.forEach((dependency) => {
            if (dependency.dependent === objId) {
                availableMasters.push({
                    name: dependency.name.master,
                    id: dependency.master,
                    objs: objects.filter((obj) => obj.type === dependency.master),
                });
            }
        });
        return availableMasters
    }


    const handleAddEvent = (e) => {
        const evType = updatedEventTypes.find((evType) => evType.id === e.target.value);
        setEventType(evType)
        
        if (evType.methodType === 'CREATE') {
            setAttributes(objectTypes.find((obj) => obj.id === evType.objType).attributes)
            setMasters(()=>getAvailableMasters(evType.objType))

            console.log(masters)
            setOpenAtt(true)
        } else if (evType.methodType === 'END') {
            setAvaObjs(getAllObjetcs().filter((obj) => obj.type === evType.objType))
            setOpenChange(true)
        }

    }

    // after clicking submit button and create an object
    const handleSubmit = () => {

        const newName = inputValues['name'] || '';
        let objects = getAllObjetcs();
        const objectExists = objects.some((obj) => obj.objType === eventType.objType && obj.objName === newName);
        if (!objectExists && newName !== '') {
            const newObj = {
                objType: eventType.objType,
                objName: newName,
            };
            let relatedTo = [];
            for (const key in chosenMasters) {
                relatedTo.push({ [key]: chosenMasters[key] })
            }
            const newEvent = {
                id: events.length,
                eventName: eventType.name,
                eventId: eventType.id,
                eventType: eventType.methodType,
                objType: eventType.objType,
                objTypeName: eventType.objName,
                objName: inputValues['name'] || '',
                relatedTo: relatedTo,
                outCome: "Success",
                isEditMode: false,
            };
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
            id: events.length,
            eventName: eventType.name,
            eventId: eventType.id,
            eventType: eventType.methodType,
            objTypeName: eventType.objName,
            objType: eventType.objType,
            objName: e.target.value,
            relatedTo: '',
            outCome: "Success",
            isEditMode: false,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent])
    }

    const handleClose = () => {
        setEventType('');
        setAttributes([])
        setInputValues({})
        setChosenMasters({})
        setAvaObjs([])
        setOpenAtt(false)
        setOpenChange(false)
        setOpen(false)
    }


    return (
        <>
            <Paper>
                <Box style={{ height: '29vh', overflowY: 'auto', width: '100%' }}>
                    <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>
                        <EventsOverview events={events} setEvents={setEvents} />
                    </TableContainer>
                    {(events.length === 0) && events && <Typography style={{ marginLeft: '20px' }}>No events added yet.</Typography>}

                    <Box style={{ display: 'flex', justifyContent: 'center' }} >
                        <IconButton onClick={() => setOpen(true)}><AddCircleIcon color='primary' /></IconButton>
                    </Box>
                    <AddEvent events={eventTypes} setOpen={setOpen} open={open} handleAddEvent={handleAddEvent} />
                    <CreateObject chosenMasters={chosenMasters} setChosenMasters={setChosenMasters} inputValues={inputValues} setInputValues={setInputValues} handleClose={handleClose} handleSubmit={handleSubmit} attributes={attributes} masters={masters} open={open_att} />
                    <ChangeObject objs={avaObjs} open={open_change} handleObj={handleObj} handleClose={handleClose} />

                </Box>
                <Box style={{ display: 'flex', marginTop: '0', width: '99.3%', borderRadius: '4px', background: "#eeeeee", padding: '3px' }}>
                    <Typography variant="body2" style={{ marginLeft: '20px' }}>Event count: {events.length}</Typography>
                </Box>
            </Paper>
            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '46px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    style={{ width: '100%' }}
                    disabled={events.length === 0}
                // onClick={handleDefend}
                >Defend</Button>
            </Box>

        </>
    )

}

export default TestCaseNew;