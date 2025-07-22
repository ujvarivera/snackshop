import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Products = () => {
    const { user } = useAuth();


    return (
        <>
        <h2>Welcome, {user?.name}</h2>
        {user?.isAdmin && <p>You are an admin.</p>}
        Products
        </>
    )
}

export default Products