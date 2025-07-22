import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

const Products = () => {
    const { user, logout } = useAuth();
    const { addToCart } = useCart();
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

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this snack?');

        if (!confirmDelete) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                withCredentials: true,
            });
            setProducts(prev => prev.filter(product => product.id !== id));
        } catch (err) {
            console.error('Delete failed', err);
        }
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

            {user && !user.isAdmin && (
                <NavLink to="/cart">🛒 Cart</NavLink>
            )}

            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - {product.price} {product.currency} ({product.stock} in stock)

                        {user?.isAdmin && (
                            <div style={{ marginTop: '5px' }}>
                                <button onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</button>
                                <button onClick={() => deleteProduct(product.id)} style={{ marginLeft: '10px', color: 'red' }}>
                                    Delete
                                </button>
                            </div>
                        )}

                        {user && !user.isAdmin && (
                            <button onClick={() => addToCart(product)}>➕</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Products