import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id}>
                            <strong>{item.name}</strong> — ${item.price}
                            <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.quantity}
                                onChange={e => updateQuantity(item.id, parseInt(e.target.value), item.stock)}
                            />
                            <button onClick={() => removeFromCart(item.id)}>🗑️</button>
                        </div>
                    ))}

                    <button onClick={handleOrder}>✅ Place Order</button>
                </>
            )}

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CartPage;
