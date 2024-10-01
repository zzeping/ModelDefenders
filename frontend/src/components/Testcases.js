import React, { useState, useEffect } from 'react';
import { TableContainer, Dialog, DialogTitle, DialogActions, List, ListItem, ListItemText, Button, Paper, Box, Typography } from '@mui/material';
import useGameTestCases from '../hook/useTestCases';
import EventsView from "./EventsView"


const Testcases = () => {

    const [open_case, setOpenCase] = useState(false); // case view dialog
    const [case_view, setCaseView] = useState({}); // the case that will be viewed in dialog
    const { data: testCases } = useGameTestCases();
    const sortedTestCases = testCases ? [...testCases].sort((a, b) => a.id - b.id) : [];



    const handleViewClose = () => {
        setOpenCase(false)
    }

    // after clicking the button of a test case
    const handelCaseView = (e) => {
        const testCase = testCases.find((testCase) => testCase.id == e.target.value)
        setCaseView(testCase)
        console.log(case_view)
        setOpenCase(true)
    }
    const handleLoadCase = (e) => {

    }

    return (
        <>
            <List style={{ paddingTop: '0px' }}>
                {sortedTestCases && sortedTestCases.map((testCase) => (
                    <ListItem key={testCase.id} style={{ height: '20px', borderBottom: '1px solid #ccc', }} secondaryAction={
                        <>
                            <Button value={testCase.id} variant="contained" onClick={handleLoadCase} style={{ height: '18px', fontSize: '10px', marginRight: '10px' }} edge="end">Load</Button>
                            <Button value={testCase.id} variant="contained" onClick={handelCaseView} style={{ height: '18px', fontSize: '10px', }} edge="end">View</Button>
                        </>
                    }>
                        <ListItemText primaryTypographyProps={{ style: { fontSize: '12px' } }} primary={`Test case: ${testCase.id} ${'\u00A0'}${'\u00A0'}${'\u00A0'}Events: ${testCase.events.length}`} />
                    </ListItem>
                ))}
            </List>
            <Dialog open={open_case} onClose={handleViewClose}>
                <DialogTitle>Test case overview</DialogTitle>
                <TableContainer sx={{ width: '100%', minWidth: 500 }} style={{ height: '27vh', overflowY: 'auto', width: '100%' }} >
                    <EventsView events={case_view?.events} />
                </TableContainer>
                <Box style={{ display: 'flex', marginTop: '10px', width: '99.3%', borderRadius: '4px', background: "#eeeeee", padding: '3px' }}>
                    <Typography variant="body2" style={{ marginLeft: 'auto', marginRight: '20px' }}>Event count: {case_view?.events?.length}</Typography>
                </Box>
                <DialogActions>
                    <Button onClick={handleViewClose}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    )

}

export default Testcases;