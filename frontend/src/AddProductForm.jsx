import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';

const AddProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [error, setError] = useState('');

  if (!user?.isAdmin) {
    return <p>Access denied. Admins only.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/products`, {
        name: form.name,
        price: parseInt(form.price),
        stock: parseInt(form.stock),
      }, { withCredentials: true });

      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 8,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Product
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Add Product
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProductForm;
