import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login'
import Products from './Products'
import RegisterForm from './RegisterForm';
import AddProductForm from './AddProductForm';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
