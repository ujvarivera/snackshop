import { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
            name,
            password,
        }, { withCredentials: true });

        navigate('/');
        } catch (err) {
        setError(err.response?.data?.error || 'Something went wrong');
        }
    }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already have an account? <NavLink to="/">Login here</NavLink></p>
    </div>
  );
}
