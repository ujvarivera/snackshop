import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
} from '@mui/material';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`, { withCredentials: true })
            .then(res => setFormData(res.data))
            .catch(() => setError('Failed to fetch product data'));
    }, [id]);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, formData, {
                withCredentials: true,
            });
            navigate('/products');
        } catch (err) {
            setError('Failed to update product');
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
                Edit Product
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Update Product
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditProductPage;
