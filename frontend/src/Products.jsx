import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Products = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/products`, {
            withCredentials: true,
        })
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <h2>Welcome, {user?.name}</h2>
            {user?.isAdmin && <p>You are an admin.</p>}

            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
                Logout
            </button>

            {user?.isAdmin && (
                <NavLink to="/add-product">
                    <button>Add New Product</button>
                </NavLink>
            )}

            <ul>
                {products.map(product => (
                <li key={product.id}>
                    {product.name} - {product.price} {product.currency} ({product.stock} in stock)

                    {user?.isAdmin && (
                    <NavLink to={`/edit-product/${product.id}`} style={{ marginLeft: '1rem' }}>
                        <button>Edit</button>
                    </NavLink>
                    )}
                </li>
                ))}
            </ul>
        </div>
    )
}

export default Products