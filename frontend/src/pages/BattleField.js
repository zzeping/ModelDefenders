import React, { useState, useEffect } from 'react';
import { Button, Paper, Box, Typography, Grid } from '@mui/material';
import useAuthStore from '../store/authStore';
import useBattleFieldStore from '../store/battleFieldStore';
import TestCase from '../components/TestCase';
import ModelImage from '../components/ModelImage';
import GraphEditor from '../components/GraphEditor';
import Mutants from '../components/Mutants';
import Testcases from '../components/Testcases';

const BattleField = () => {

    const user = useAuthStore((state) => state.user);
    const gameId = useBattleFieldStore((state) => state.gameId);
    const modelId = useBattleFieldStore((state) => state.modelId);
    const role = useBattleFieldStore((state) => state.role);


    
    return (
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={5}>
                <Typography variant="h5">Model under test</Typography>
                {modelId && (
                    <ModelImage modelId={modelId} />
                )}
                <Typography style={{ marginTop: '105px' }} variant="h5">{role === "defender" ? 'All mutants' : 'All test cases'}</Typography>
                <Typography variant="body2" style={{ background: "#eeeeee", borderRadius: '4px', paddingLeft: '10px' }}>{role === "defender" ? 'All mutants' : 'Test cases'}</Typography>
                <Paper style={{ height: '24vh', overflowY: 'auto', width: '100%' }} >
                    {role === "defender" ? <Mutants /> : <Testcases />}
                </Paper>
            </Grid>
            <Grid item xs={7}>
                <Typography variant="h5">{role === "defender" ? 'Define a new test case here' : 'Model a new mutant here'}</Typography>
                <Typography variant="body2" style={{ background: "#eeeeee", borderRadius: '4px', paddingLeft: '10px' }}>{role === "defender" ? 'Test case' : 'EDG'}</Typography>
                {role === "defender" ? <TestCase /> : <GraphEditor />}

                <Typography style={{ marginTop: '38px' }} variant="h5">{role === "defender" ? 'Existing test cases' : 'Existing mutants'}</Typography>
                <Typography variant="body2" style={{ background: "#eeeeee", borderRadius: '4px', paddingLeft: '10px' }}>{role === "defender" ? 'Test cases from previous test suites' : 'All mutants'}</Typography>
                <Paper style={{ height: '24vh', overflowY: 'auto', width: '100%' }} ></Paper>
            </Grid>
        </Grid>
    )
}

export default BattleField;
