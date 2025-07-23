import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login'
import Products from './Products'
import RegisterForm from './RegisterForm';
import AddProductForm from './AddProductForm';
import EditProductPage from './EditProductPage';
import CartPage from './CartPage';
import Orders from './Orders';
import { PublicRoute, PrivateRoute, AdminRoute } from './routes/Routes';
import Navbar from './layouts/NavBar';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
