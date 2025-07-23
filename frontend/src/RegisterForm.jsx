import { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
    <Grid>
      <Grid component={Paper} elevation={6} square
        sx={{
          maxWidth: 'fit-content',
          mx: 'auto',
          p: 2,
          mt: 4,
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleRegister}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Username"
              name="name"
              autoComplete="username"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Grid>

      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link
          component={NavLink}
          to="/"
          sx={{ color: '#002fffff', fontWeight: 'bold' }}
        >
          Sign In
        </Link>
      </Typography>
    </Grid>
  );
}
