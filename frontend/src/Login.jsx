import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
    Avatar,
    Button,
    TextField,
    Paper,
    Grid,
    Typography,
    Box,
    Alert,
    Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                name,
                password
            }, {
                withCredentials: true // for cookies
            });

            if (res.data.authenticated) {
                const userData = {
                    id: res.data.userId,
                    name,
                    isAdmin: res.data.isAdmin,
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                navigate('/products');
            } else {
                setMessage('Login failed');
            }
        } catch (err) {
            setMessage('Error logging in');
            console.error(err);
        }
    };

    return (
        <Grid>
            <Grid component={Paper} elevation={6} square
                sx={{
                    maxWidth: 'fit-content',
                    mx: 'auto',
                    p: 2,
                    mt: 4, 
                }}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
                        {message && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {message}
                            </Alert>
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Username"
                            name="name"
                            autoComplete="username"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Typography variant="body2" sx={{ mt: 2 }} align="center">
                Don’t have an account?{' '}
                <Link
                    component={NavLink}
                    to="/register"
                    sx={{ color: '#002fffff', fontWeight: 'bold' }}
                >
                    Register
                </Link>
            </Typography>
        </Grid>
    );
};

export default Login;
