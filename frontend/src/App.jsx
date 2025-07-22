import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login'
import Products from './Products'
import RegisterForm from './RegisterForm';
import AddProductForm from './AddProductForm';
import EditProductPage from './EditProductPage';
import CartPage from './CartPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
