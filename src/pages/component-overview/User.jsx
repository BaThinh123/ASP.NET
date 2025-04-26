import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ fullName: '', email: '', phone: '', address: '', role: '', status: '', createdBy: '', id: null });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get('/User', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Dữ liệu trả về:', response.data);
        setUsers(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy user:', error));
  }, []);

  const handleSave = () => {
    if (!userForm.fullName || !userForm.email || !userForm.status) {
      console.error('Tên, email và trạng thái là bắt buộc!');
      return;
    }

    const requestBody = {
      id: userForm.id,
      fullName: userForm.fullName,
      email: userForm.email,
      phone: userForm.phone,
      address: userForm.address,
      role: userForm.role || 'Customer',
      status: userForm.status,
      createdBy: userForm.createdBy
    };

    if (editing) {
      axios.put(`/User/${userForm.id}`, requestBody)
        .then(response => {
          setUsers(users.map(user => user.id === userForm.id ? response.data : user));
          setUserForm({ fullName: '', email: '', phone: '', address: '', role: '', status: '', createdBy: '', id: null });
          setOpenDialog(false);
          alert('Cập nhật người dùng thành công!');
        })
        .catch(error => {
          if (error.response?.data?.errors) {
            console.error('Lỗi khi sửa user:', error.response.data.errors);
          } else {
            console.error('Lỗi khi sửa user:', error);
          }
        });
    } else {
      axios.post('/User', requestBody)
        .then(response => {
          setUsers([...users, response.data]);
          setUserForm({ fullName: '', email: '', phone: '', address: '', role: '', status: '', createdBy: '', id: null });
          setOpenDialog(false);
        })
        .catch(error => {
          if (error.response?.data?.errors) {
            console.error('Lỗi khi thêm user:', error.response.data.errors);
          } else {
            console.error('Lỗi khi thêm user:', error);
          }
        });
    }
  };

  const handleEdit = (user) => {
    setUserForm({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'Customer',
      status: user.status,
      createdBy: user.createdBy || ''
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (userId) => {
    axios.delete(`/User/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error('Lỗi khi xóa user:', error);
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserForm({ fullName: '', email: '', phone: '', address: '', role: '', status: '', createdBy: '', id: null });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? '' : date.toLocaleString();
    } catch {
      return '';
    }
  };

  return (
    <MainCard title="Danh sách người dùng">
      <Button variant="contained" color="primary" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Tên</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Địa chỉ</strong></TableCell>
              <TableCell><strong>Vai trò</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{user.createdBy}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(user)} sx={{ marginRight: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên người dùng"
            name="fullName"
            value={userForm.fullName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={userForm.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={userForm.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={userForm.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Vai trò"
            name="role"
            value={userForm.role}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={userForm.status}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Người tạo"
            name="createdBy"
            value={userForm.createdBy}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UserTable;
