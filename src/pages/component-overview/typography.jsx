import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', status: '', id: null });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  // Lấy danh sách danh mục khi component được render
  useEffect(() => {
    axios.get('/Category', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy danh mục:', error));
  }, []);

  // Lưu (thêm mới hoặc cập nhật danh mục)
  const handleSave = () => {
    if (!categoryForm.name || !categoryForm.status) {
      console.error('Tên và trạng thái là bắt buộc!');
      alert('Tên và trạng thái là bắt buộc!');
      return;
    }

    const requestBody = {
      id: categoryForm.id ? categoryForm.id : undefined, 
      Name: categoryForm.name, 
      description: categoryForm.description || "", 
      status: categoryForm.status,
      updatedBy: 'admin',
      createdBy: 'admin'
    };

    console.log("Request Body:", requestBody);

    if (editing) {
      axios.put(`/Category/${categoryForm.id}`, requestBody)
        .then(() => {
          setCategories(categories.map(cat => cat.id === categoryForm.id ? { ...cat, ...requestBody } : cat));
          setCategoryForm({ name: '', description: '', status: '', id: null });
          setOpenDialog(false);
          alert('Cập nhật danh mục thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi sửa danh mục:', error.response?.data || error);
          alert('Có lỗi xảy ra khi cập nhật danh mục!');
        });
    } else {
      axios.post('/Category', requestBody)
        .then(response => {
          setCategories([...categories, response.data]);
          setCategoryForm({ name: '', description: '', status: '', id: null });
          setOpenDialog(false);
          alert('Thêm danh mục thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi thêm danh mục:', error.response?.data || error);
          alert('Có lỗi xảy ra khi thêm danh mục! ' + JSON.stringify(error.response?.data));
        });
    }
  };

  const handleEdit = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description || '',
      status: category.status
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (categoryId) => {
    axios.delete(`/Category/${categoryId}`)
      .then(() => {
        setCategories(categories.filter(cat => cat.id !== categoryId));
        alert('Xóa danh mục thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi xóa danh mục:', error);
        alert('Có lỗi xảy ra khi xóa danh mục!');
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCategoryForm({ name: '', description: '', status: '', id: null });
    setEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm({ ...categoryForm, [name]: value });
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
    <MainCard title="Danh sách danh mục">
      <Button variant="contained" color="primary" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Tên</strong></TableCell>
              <TableCell><strong>Mô tả</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>{cat.status}</TableCell>
                <TableCell>{formatDate(cat.createdAt)}</TableCell>
                <TableCell>{cat.createdBy}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(cat)} sx={{ marginRight: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(cat.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            name="name"
            value={categoryForm.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            name="description"
            value={categoryForm.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={categoryForm.status}
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

export default CategoryTable;
