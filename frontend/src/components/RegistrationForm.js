import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hook/useAuth';
import { Button, TextField, IconButton, Typography, InputAdornment, OutlinedInput, InputLabel, FormControl } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';



const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleRegister, isLoading, error } = useRegister();
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [error_r, setError_r] = useState('');

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [showCPassword, setShowCPassword] = React.useState(false);
    const handleClickShowCPassword = () => setShowCPassword((show) => !show);
    const handleMouseDownCPassword = (event) => {
        event.preventDefault();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.length < 4) {
            setError_r('Username must be at least 4 characters long.');
            return;
        }
        if (password.length < 4) {
            setError_r('Password must be at least 4 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError_r('Passwords do not match.');
            return;
        }
        setError_r('');
        try {
            await handleRegister(username, password);
            navigate('/');
        } catch (error) {
            setError_r('Registration failed. Username exists.');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        }
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
            <FormControl fullWidth margin="dense" >
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
            <FormControl fullWidth margin="dense" >
                <InputLabel htmlFor="confirmPassword">Comfirm Password</InputLabel>
                <OutlinedInput
                    variant="outlined"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showCPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle comfirm password visibility"
                                onClick={handleClickShowCPassword}
                                onMouseDown={handleMouseDownCPassword}
                                edge="end"
                            >
                                {showCPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            {error_r && (
                <Typography variant="body2" color="error" style={{ marginTop: '8px' }}>
                    {error_r}
                </Typography>
            )}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                style={{ marginTop: '16px' }}
            >
                {isLoading ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
};

export default RegistrationForm;
