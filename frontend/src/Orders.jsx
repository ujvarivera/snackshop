import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext'; // or wherever your auth context is
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Stack,
} from '@mui/material';

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
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 8, px: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        All Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Typography>No orders yet.</Typography>
      ) : (
        orders.map((order) => (
          <Paper
            key={order.order_id}
            sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {order.user_name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6">{order.user_name}</Typography>
              <Typography variant="body2" color="text.secondary" ml="auto">
                {new Date(order.created_at).toLocaleString()}
              </Typography>
            </Stack>

            <Typography variant="subtitle1" gutterBottom>
              Items:
            </Typography>
            <List dense disablePadding>
              {order.items.map((item, i) => (
                <ListItem key={i} sx={{ pl: 0 }}>
                  <ListItemText
                    primary={`${item.product_name} — ${item.price} HUF × ${item.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Orders;
