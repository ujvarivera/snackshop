import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
    Alert,
    Paper,
    Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleOrder = async () => {
        if (!user) {
            setError('You must be logged in to place an order.');
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders`,
                {
                    user_id: user.id,
                    items: cart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity,
                    }))
                },
                { withCredentials: true }
            );

            setMessage(`Order #${res.data.order_id} placed successfully!`);
            clearCart();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order.');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 8, px: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Your Cart
            </Typography>

            {cart.length === 0 ? (
                <Typography variant="body1">Your cart is empty.</Typography>
            ) : (
                <>
                    {cart.map((item) => (
                        <Paper
                            key={item.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                mb: 2,
                            }}
                            elevation={2}
                        >
                            <Box>
                                <Typography fontWeight="bold">{item.name}</Typography>
                                <Typography variant="body2">${item.price}</Typography>
                            </Box>

                            <TextField
                                type="number"
                                label="Quantity"
                                size="small"
                                inputProps={{
                                    min: 1,
                                    max: item.stock,
                                }}
                                value={item.quantity}
                                onChange={(e) =>
                                    updateQuantity(item.id, parseInt(e.target.value), item.stock)
                                }
                                sx={{ width: 100, mx: 2 }}
                            />

                            <IconButton
                                onClick={() => removeFromCart(item.id)}
                                color="error"
                                aria-label="remove item"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Paper>
                    ))}

                    <Divider sx={{ my: 3 }} />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOrder}
                        fullWidth
                        size="large"
                    >
                        ✅ Place Order
                    </Button>
                </>
            )}

            {message && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    {message}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default CartPage;
