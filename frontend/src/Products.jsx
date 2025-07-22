import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Products = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/products`, {
            withCredentials: true,
        })
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Welcome, {user?.name}</h2>
            {user?.isAdmin && <p>You are an admin.</p>}
            <ul>
                {products.map(p => (
                <li key={p.id}>{p.name} - {p.price} {p.currency}</li>
                ))}
            </ul>
        </div>
    )
}

export default Products