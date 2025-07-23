import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
} from '@mui/material';

const Products = () => {
    const { user } = useAuth();
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
        <>
            {user?.isAdmin && (
                <Box sx={{ mb: 3, textAlign: 'left', px: 3, my: 2 }}>
                    <Button
                        component={NavLink}
                        to="/add-product"
                        variant="contained"
                        color="primary"
                    >
                        Add New Product
                    </Button>
                </Box>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    px: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1fr', // 3 columns on medium and up
                    },
                }}
            >
                {products.map(product => (
                    <Grid key={product.id} sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image="/snack.jpg"
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: {product.price} {product.currency} <br />
                                    Stock: {product.stock}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {user?.isAdmin ? (
                                    <>
                                        <Button size="small" onClick={() => navigate(`/edit-product/${product.id}`)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            type="button"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                ) : user ? (
                                    <Button size="small" onClick={() => addToCart(product)}>
                                        ➕ Add to Cart
                                    </Button>
                                ) : null}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Box>
        </>
    )
}

export default Products