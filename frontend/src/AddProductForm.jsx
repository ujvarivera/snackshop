import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

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
    <div>
      <h2>Add New Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
