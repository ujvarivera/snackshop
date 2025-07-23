import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar
            position="static"
            sx={{
                width: '100%',
                margin: 0,
                padding: 0,
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ px: 2 }}>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button
                        component={NavLink}
                        to="/products"
                        sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                        Products
                    </Button>
                    {
                        user?.isAdmin &&
                        <Button
                            component={NavLink}
                            to="/orders"
                            sx={{ color: 'white', fontWeight: 'bold' }}
                        >
                            Orders
                        </Button>
                    }

                    {
                        (user && !user.isAdmin) &&
                        <Button
                            component={NavLink}
                            to="/cart"
                            sx={{ color: 'white', fontWeight: 'bold' }}
                        >
                            🛒 Cart
                        </Button>
                    }
                </Box>

                {user && (
                    <Button onClick={handleLogout} sx={{ color: 'white', fontWeight: 'bold' }}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
