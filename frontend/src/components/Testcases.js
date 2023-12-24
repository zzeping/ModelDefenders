import React, { useState, useEffect } from 'react';
import { TableContainer, Dialog, DialogTitle, DialogActions, List, ListItem, ListItemText, Button, Paper, Box, Typography } from '@mui/material';




const Testcases = () => {

    const [open_case, setOpenCase] = useState(false); // case view dialog
    const [case_view, setCaseView] = useState({}); // the case that will be viewed in dialog



    const handleViewClose = () => {
        setOpenCase(false)
    }

    // after clicking the button of a test case
    // const handelCaseView = (e) => {
    //     const testCase = testCases.find((testCase) => testCase.id == e.target.value)
    //     setCaseView(testCase)
    //     setOpenCase(true)
    // }

    return (
        <>
            {/* <Paper style={{ height: '7vh', overflowY: 'auto', width: '100%' }} >
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

        </>
    )

}

export default Testcases;