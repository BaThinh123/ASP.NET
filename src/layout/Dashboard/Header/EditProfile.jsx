import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Typography, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, Box, Avatar,
  IconButton
} from '@mui/material';
import api from '../../../api/axios';
import { CameraAlt } from '@mui/icons-material';

export default function EditUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [newUserDetails, setNewUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer',
    status: 'active',
    avatarUrl: '',
  });

  const [newAvatar, setNewAvatar] = useState(null);

  // Lấy dữ liệu người dùng
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/User/${id}`);
      const data = response.data;
      setNewUserDetails({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        role: data.role || 'customer',
        status: data.status || 'active',
        avatarUrl: data.avatarUrl || '',
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      alert('Không thể lấy thông tin người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUserData();
  }, [id]);

  // Lấy thông tin từ localStorage nếu đã đăng nhập trước đó
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setNewUserDetails(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setNewUserDetails({
      ...newUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
        setNewUserDetails({ ...newUserDetails, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const { fullName, email, phone } = newUserDetails;
    if (!fullName || !email || !phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ!');
      return false;
    }

    return true;
  };

  const handleSaveUserDetails = async () => {
    const { ...userData } = newUserDetails;

    userData.role = userData.role.toLowerCase();
    userData.status = userData.status.toLowerCase();
    userData.id = parseInt(id);

    try {
      const response = await api.put(`/User/${id}`, userData);
      alert('Cập nhật thành công!');

      // Cập nhật localStorage với thông tin người dùng mới
      const updatedUserInfo = { ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUserInfo));

      // Cập nhật state với thông tin người dùng mới
      setNewUserDetails(updatedUserInfo);

      // Chuyển hướng đến trang thông tin cá nhân hoặc trang bạn muốn
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi lưu thông tin người dùng:', error);
      const errData = error.response?.data;

      if (errData?.errors) {
        const messages = Object.values(errData.errors).flat().join('\n');
        alert(messages || 'Cập nhật thất bại!');
      } else {
        alert(errData?.title || 'Cập nhật thất bại!');
      }
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleSaveUserDetails();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ padding: 3, width: '80%', maxWidth: 900 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Chỉnh sửa thông tin cá nhân
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2 }}
                src={newUserDetails.avatarUrl || '/default-avatar.png'}
              />
              <Button
                variant="contained"
                color="primary"
                component="label"
                startIcon={<CameraAlt />}
              >
                Chọn ảnh đại diện
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ và tên"
                name="fullName"
                fullWidth
                value={newUserDetails.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={newUserDetails.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                name="phone"
                fullWidth
                value={newUserDetails.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa chỉ"
                name="address"
                fullWidth
                value={newUserDetails.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Vai trò</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={newUserDetails.role}
                  onChange={handleChange}
                  label="Vai trò"
                >
                  <MenuItem value="customer">Khách hàng</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={newUserDetails.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Kích hoạt</MenuItem>
                  <MenuItem value="inactive">Vô hiệu hóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Lưu thông tin
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
