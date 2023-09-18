import Box from '@mui/material/Box';
import React from 'react';
import {
    isRouteErrorResponse,
    useRouteError,
} from 'react-router-dom';
import NavBar from '../components/NavBar';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <>
            <NavBar />
            <Box padding={5}>
                <h1>Oops</h1>
                <p>
                    {isRouteErrorResponse(error)
                        ? 'This page does not exist.'
                        : 'An unexpected error occurred.'}
                </p>
            </Box>
        </>
    );
};

export default ErrorPage;