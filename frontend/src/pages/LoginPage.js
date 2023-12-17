import React, { useState } from 'react';
import { Typography, Grid, Container, Paper, Box } from '@mui/material';
import logo from "../assets/logo-white.svg";
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';

const LoginPage = () => {

    const [userHasAccount, setUserHasAccount] = useState(true);
    const toggleForm = () => {
        setUserHasAccount((prevUserHasAccount) => !prevUserHasAccount);
    };

    return (
        <Container maxWidth={false}>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '100vh',
                        }}
                    >
                        <Paper elevation={3} style={{ padding: '24px', maxWidth: '400px' }}>
                            <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
                                {userHasAccount ? "Sign in " : "Sign up"}
                            </Typography>
                            {userHasAccount ? (
                                <LoginForm />
                            ) : (
                                <RegistrationForm />
                            )}
                            <Typography variant="body2" align="center" marginTop='16px'>
                                {userHasAccount ? "Don't have an account? " : "Already have an account? "}
                                <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={toggleForm}
                                >
                                    {userHasAccount ? 'Register here' : 'Login here'}
                                </span>
                            </Typography>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box
                        style={{
                            background: 'linear-gradient(to bottom, #82aef5, #1159cd)',
                            minHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px',
                            margin: '20px 0',
                            borderRadius: '8px',
                        }}
                    >
                        <Box display="flex" alignItems="center" marginBottom="16px">
                            <img src={logo} alt="Logo" style={{ marginRight: '16px' }} />
                            <Typography variant="h4" gutterBottom style={{ color: '#fff', margin: 0 }}>
                                Model Defenders
                            </Typography>
                        </Box>
                        <Typography variant="body1" style={{ color: '#fff' }}>
                            A Mutation Testing Game for Model-Driven Engineering
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LoginPage;
