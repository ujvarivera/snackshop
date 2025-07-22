import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Login = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
        const res = await axios.post(import.meta.env.VITE_LOGIN, {
            name,
            password
        }, {
            withCredentials: true // for cookies
        });

        if (res.data.authenticated) {
            const userData = {
                // id: res.data.userId,
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
        <div style={{ maxWidth: 300, margin: 'auto' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <div>
            <label>Username:</label><br />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
            <label>Password:</label><br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
        </form>
        <p>{message}</p>
        </div>
    );
    };

export default Login;
