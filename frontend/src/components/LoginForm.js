import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hook/useAuth';
import { Button, TextField, IconButton, InputAdornment, OutlinedInput, InputLabel, FormControl } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuthStore from '../store/authStore'
import jwtDecode from "jwt-decode";
import APIClient from '../services/api-client';
import useGamesStore from '../store/gamesStore';
import useBattleFieldStore from '../store/battleFieldStore';

const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { handleLogin, isLoading, error } = useLogin();
    const [showPassword, setShowPassword] = React.useState(false);
    const { login, logout } = useAuthStore();
    const { removeGames } = useGamesStore();
    const { leaveField } = useBattleFieldStore();
    const user = useAuthStore((state) => state.user)

    // when login page is loaded, this will run to check if the user is already login. 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            const decoded = jwtDecode(token);
            const apiClient = new APIClient('/user');
            apiClient.get(decoded.userId, token)
                .then((userData) => {
                    if (!userData) {
                        logout();
                        removeGames();
                        leaveField();
                        localStorage.removeItem('token');
                    } else {
                        login(token, userData);
                        navigate('/');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                    logout();
                    removeGames();
                    leaveField();
                    localStorage.removeItem('token');
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(username, password);
            navigate('/');
        } catch (error) {
            if(error.code === "ERR_BAD_REQUEST") {
                alert('Invalid username or password');
            } else if(error.code === "ERR_NETWORK") {
                alert('Server unavailable');
            } else {
                alert(error.message)
            }
            setUsername('');
            setPassword('');
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <form onSubmit={handleSubmit}>
            <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="dense"
            />
            <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                    variant="outlined"
                    required
                    id="password"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                style={{ marginTop: '16px' }}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    )
}

export default LoginForm;