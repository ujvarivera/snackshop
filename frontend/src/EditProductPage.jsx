import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        <div>
            <h2>Edit Product</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default EditProductPage;
