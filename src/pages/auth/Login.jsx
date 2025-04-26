import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AuthWrapper from 'sections/auth/AuthWrapper';
import api from '../../api/axios'; // Axios instance

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      // ✅ Giả định response trả về dạng: { token, fullName, user: { id, ... } }
      const { token, fullName, user } = response.data;

      // ✅ Lưu vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('userId', user.id); // ✅ Thêm dòng này để lưu userId

      setFullName(fullName);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sai email hoặc mật khẩu.');
      } else if (err.response?.status === 403) {
        setError('Chỉ quản trị viên mới được phép đăng nhập.');
      } else {
        setError('Đã xảy ra lỗi khi đăng nhập.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h3">ĐĂNG NHẬP</Typography>
            <Typography component={Link} to="/register" variant="body1" color="primary">
              Đăng Ký
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
            />
            {error && <Typography color="error">{error}</Typography>}
            {fullName && (
              <Typography color="success.main" sx={{ mt: 1 }}>
                Chào mừng, {fullName}!
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            <Typography
              component={Link}
              to="/forgot-password"
              variant="body2"
              color="primary"
              sx={{ display: 'block', textAlign: 'right', mt: 1 }}
            >
              Quên mật khẩu?
            </Typography>
          </form>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
