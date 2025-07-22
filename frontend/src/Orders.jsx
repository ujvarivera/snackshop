import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext'; // or wherever your auth context is

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    axios.get(`${import.meta.env.VITE_API_URL}/orders`, { withCredentials: true })
      .then(res => setOrders(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load orders'));
  }, [user]);

  if (!user || !user.isAdmin) {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div>
      <h2>All Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.order_id} style={{ border: '1px solid gray', marginBottom: '1rem', padding: '1rem' }}>
            <p><strong>User:</strong> {order.user_name}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.product_name} — {item.price} HUF × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
