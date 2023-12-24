import { TableContainer, Dialog, DialogTitle, DialogActions, List, ListItem, ListItemText, Table, Button, Select, MenuItem, IconButton, Paper, TableHead, TableRow, TableCell, Box, Typography, TableBody } from '@mui/material';
import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddEvent from './AddEvent';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import CreateObject from './CreateObject';
import ChangeObject from './ChangeObject';
import EventsOverview from './EventsOverview';
import useAddTestCase from '../hook/useAddTestCase';
import check from './check';
import useGameMutants from '../hook/useMutants';


const TestCase = () => {

    const modelId = useBattleFieldStore((state) => state.modelId);
    const { handleAddTestCase, isAdding, error } = useAddTestCase();
    const { data: mutants } = useGameMutants();

    const { data: model } = useModel(modelId); // get the model data of the current game

    const [open, setOpen] = useState(false); // add event dialog 
    const [open_att, setOpenAtt] = useState(false); // add attributes dialog
    const [open_change, setOpenChange] = useState(false); // the dialog of ending or modifying an object
    const [open_case, setOpenCase] = useState(false); // case view dialog
    const [case_view, setCaseView] = useState({}); // the case that will be viewed in dialog
    const [end, setEnd] = useState(false) // indicate if the changing is ending or not
    const [attributes, setAttributes] = useState([]); // attributes array for each object
    const [masters, setMasters] = useState([]); //matsers for dependent objects
    const [avaObjs, setAvaObjs] = useState([]); // the objects that can be ended or be modified. 
    const [dependencyFail, setDependencyFail] = useState(false);

    // data of the model reading from mxp file
    const eventTypes = model.content.metamodel.eventTypes
    const methods = model.content.metamodel.methods
    const objectTypes = model.content.metamodel.objectTypes
    const dependencyTypes = model.content.metamodel.dependencies
    const ownedMethods = methods.filter((method) => method.provenance === 'OWNED');

    // each test case suite has testCases, each test case has objects, events, dependencies
    const [objects, setObjects] = useState([]);  // objName, objTypeID
    const [events, setEvents] = useState([]);  // eventID, eventTypeID, objType, objID
    const [dependencies, setDependencies] = useState([]); // masterName, dependentName, dependencyType
    // const [testCases, setTestCases] = useState([]);
    const [testCase, setTestCase] = useState('');
    const [expected, setExpected] = useState('Success'); // set the expected value for the current test case. 


    const [objectType, setObjectType] = useState(''); // indicate the objectTpye id when creating an object
    const [eventId, setEventId] = useState(''); // indicate the event id when creating an event
    const [eventType, setEventType] = useState('');

    const [inputValues, setInputValues] = useState({}); //store the input attributes when creating an object 
    const [chosenMasters, setChosenMasters] = useState({}); //store the chosen masters when creating an object



    // handel adding a test case for the current test suite 
    // const handleAddCase = () => {
    //     const newCase = {
    //         id: testCases.length + 1,
    //         expected_out: expected,
    //         count: events.length,
    //         event_tests: events,
    //         obj_tests: objects,
    //         dependency_tests: dependencies,
    //     }
    //     setTestCase(newCase)
    //     setTestCases((prev) => [...prev, newCase])
    //     setObjects([])
    //     setDependencies([])
    //     setEvents([])
    // }

    // after clicking the button of a test case
    // const handelCaseView = (e) => {
    //     const testCase = testCases.find((testCase) => testCase.id == e.target.value)
    //     setCaseView(testCase)
    //     setOpenCase(true)
    // }


    // after clicking the add button of an event
    const handleAddEvent = (e) => {
        const method = ownedMethods.find((method) => method.ownerEventType === e.target.value)
        const matching_obj = objectTypes.find((obj) => obj.id === method.ownerObjectType);
        setEventType(method.type);
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
            setEventId(method.ownerEventType)
            setOpenAtt(true)

        } else if (method.type === 'END') {
            setObjectType(method.ownerObjectType)
            setEventId(method.ownerEventType)
            setAvaObjs(objects.filter((obj) => {

                if (obj.objType === method.ownerObjectType) {
                    const dependenciesForObjName = dependencies.filter(dep => dep.master === obj.objName);
                    const allDependents = dependenciesForObjName.map(dep => dep.dependent);
                    if (allDependents.length !== 0) {
                        if (!allDependents.every(dependent => !objects.map(obj => obj.objName).includes(dependent))) { // the dependent object exists in the objects array
                            setDependencyFail(true); // if one object the is ended and his dependent still exist, the result has to be fail. 
                        }
                    }
                    return true
                }
                return false;
            }))
            setOpenChange(true)
            setEnd(true)
        } else {
            setObjectType(method.ownerObjectType)
            setEventId(method.ownerEventType)
            setAvaObjs(objects.filter((obj) => obj.objType === method.ownerObjectType))
            setOpenChange(true)
        }

    }



    const selectStyle = {
        background: (expected === "Success" ? "green" : "red"),
        fontSize: '14px',
        color: 'white',
        height: '20px',
        marginLeft: '5px',
    };

    const menuItemStyle = {
        fontSize: '14px',
        height: '20px',
    };

    // after clicking submit button and create an object
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
                eventId: eventId,
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
        if (masters.length !== Object.keys(chosenMasters).length) setDependencyFail(true) // when there is unset master, the expected should be fail
    }

    // adding event when ending or modifying an object 
    const handleObj = (e) => {

        const newEvent = {
            id: events.length,
            eventId: eventId,
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

    // close the case view dialog
    // const handleViewClose = () => {
    //     setOpenCase(false)
    // }

    // close the add event, add attributes, and end/modify dialog  
    const handleClose = () => {
        setAvaObjs([])
        setEventType('')
        setEventId('')
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
        const newCase = {
            expected_out: expected,
            count: events.length,
            event_tests: events,
            obj_tests: objects,
            dependency_tests: dependencies,
        }
        setTestCase(newCase)

        console.log(newCase)
        console.log(mutants)
        console.log(ownedMethods)
        console.log(objects)

        if (expected === "Success" && dependencyFail) {
            alert("The expected result cannot be success.")
        } else if (expected === "Fail" && !dependencyFail) {
            alert("The expected result cannot be fail.")
        } else {
            const mutants_new = check(mutants, events, expected, dependencies);
            console.log(mutants_new)
        }




        // try {
        //     const newTestCase = await handleAddTestCase(newCase)
        //   } catch (error) {
        //     console.error('Axios error:', error);
        //   }
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
                <Box style={{ height: '29vh', overflowY: 'auto', width: '100%' }}>
                    <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>
                        <EventsOverview EIDtoName={EIDtoName} OIDtoName={OIDtoName} events={events} />
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
                    <Typography variant="body2" style={{ marginLeft: '20px' }}>Expected outcome:</Typography>
                    <Select size="small" value={expected} style={selectStyle} onChange={(e) => setExpected(e.target.value)}>
                        <MenuItem style={menuItemStyle} value="Success">Success</MenuItem>
                        <MenuItem style={menuItemStyle} value="Fail">Fail</MenuItem>
                    </Select>
                    <Typography variant="body2" style={{ marginLeft: '20px' }}>Event count: {events.length}</Typography>
                    <Button onClick={() => { setEvents([]); setObjects([]); setDependencies([]); setDependencyFail(false) }} style={{ marginLeft: '20px', height: '20px', fontSize: '10px', padding: '5px', color: 'red' }}>Clear events</Button>
                    {/* <Button disabled={events.length === 0} onClick={handleAddCase} variant="contained" style={{ marginRight: '20px', height: '20px', marginLeft: 'auto', fontSize: '10px', padding: '5px' }}>Add test case</Button> */}
                </Box>
            </Paper>

            {/* <Typography variant="body2" style={{ background: "#eeeeee", borderRadius: '4px', paddingLeft: '10px', marginTop: '10px' }}>Test cases in current test suite</Typography>
            <Paper style={{ height: '7vh', overflowY: 'auto', width: '100%' }} >
                <List style={{ paddingTop: '0px' }}>
                    {testCases && testCases.map((testCase) => (
                        <ListItem key={testCase.id} style={{ height: '20px', borderBottom: '1px solid #ccc', }} secondaryAction={<Button value={testCase.id} variant="contained" onClick={handelCaseView} style={{ height: '18px', fontSize: '10px', }} edge="end">View</Button>}>
                            <ListItemText primaryTypographyProps={{ style: { fontSize: '12px' } }} primary={`Test case: ${testCase.id} ${'\u00A0'}${'\u00A0'}${'\u00A0'}Events: ${testCase.count}`} />
                        </ListItem>
                    ))}
                </List>
                <Dialog open={open_case} onClose={handleViewClose}>
                    <DialogTitle>Test case overview</DialogTitle>
                    <TableContainer sx={{ width: '100%', minWidth: 500 }} style={{ height: '27vh', overflowY: 'auto', width: '100%' }} >
                        <EventsOverview EIDtoName={EIDtoName} OIDtoName={OIDtoName} events={case_view?.event_tests} />
                    </TableContainer>
                    <Box style={{ display: 'flex', marginTop: '10px', width: '99.3%', borderRadius: '4px', background: "#eeeeee", padding: '3px' }}>
                        <Typography style={{ marginLeft: '8px' }} variant="body2">Expected outcome: {case_view?.expected_out}</Typography>
                        <Typography variant="body2" style={{ marginLeft: 'auto', marginRight: '20px' }}>Event count: {case_view?.count}</Typography>
                    </Box>
                    <DialogActions>
                        <Button onClick={handleViewClose}>Close</Button>
                    </DialogActions>
                </Dialog>

            </Paper> */}
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