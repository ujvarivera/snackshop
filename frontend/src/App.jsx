import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login'
import Products from './Products'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
