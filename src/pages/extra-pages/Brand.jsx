import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const BrandTable = () => {
  const [brands, setBrands] = useState([]);
  const [brandForm, setBrandForm] = useState({ name: '', logo: null, status: '', id: null });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  useEffect(() => {
    axios.get('/Brand', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy brand:', error));
  }, []);

  const handleSave = () => {
    if (!brandForm.name || !brandForm.status) {
      alert('Tên và trạng thái là bắt buộc!');
      return;
    }

    const formData = new FormData();
    formData.append('name', brandForm.name);
    formData.append('status', brandForm.status);
    formData.append('createdBy', 'admin'); // Gán cố định
    if (brandForm.logo) formData.append('logo', brandForm.logo);

    if (editing) {
      formData.append('id', brandForm.id);

      axios.put(`/Brand/${brandForm.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setBrands(prevBrands => prevBrands.map(brand => brand.id === brandForm.id ? response.data : brand)); // Cập nhật thương hiệu đã sửa
          resetForm();
          alert('Cập nhật thương hiệu thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi sửa brand:', error);
          alert('Cập nhật thất bại. Vui lòng thử lại.');
        });
    } else {
      axios.post('/Brand', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setBrands(prevBrands => [...prevBrands, response.data]); // Thêm thương hiệu mới vào danh sách
          resetForm();
          alert('Thêm thương hiệu thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi thêm brand:', error);
          alert('Thêm mới thất bại. Vui lòng thử lại.');
        });
    }
  };

  const handleEdit = (brand) => {
    setBrandForm({
      id: brand.id,
      name: brand.name,
      logo: null,
      status: brand.status
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const confirmDelete = (brandId) => {
    setBrandToDelete(brandId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    axios.delete(`/Brand/${brandToDelete}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {
        setBrands(prevBrands => prevBrands.filter(brand => brand.id !== brandToDelete)); // Loại bỏ thương hiệu đã xóa khỏi danh sách
        setDeleteDialogOpen(false);
        setBrandToDelete(null);
        alert('Xóa thương hiệu thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi xóa brand:', error);
        alert('Xóa thất bại. Vui lòng thử lại.');
      });
  };

  const resetForm = () => {
    setOpenDialog(false);
    setBrandForm({ name: '', logo: null, status: '', id: null });
    setEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBrandForm({ ...brandForm, [name]: value });
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setBrandForm({ ...brandForm, logo: file });
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
    <MainCard title="Danh sách thương hiệu">
      <Button variant="contained" color="primary" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Tên</strong></TableCell>
              <TableCell><strong>Logo</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.length > 0 ? brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.id}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name} width={50} /> : 'Chưa có'}</TableCell>
                <TableCell>{brand.status}</TableCell>
                <TableCell>{formatDate(brand.createdAt)}</TableCell>
                <TableCell>{brand.createdBy}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(brand)} sx={{ marginRight: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => confirmDelete(brand.id)}>
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

      {/* Dialog tạo/sửa thương hiệu */}
      <Dialog open={openDialog} onClose={resetForm}>
        <DialogTitle>{editing ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên thương hiệu"
            name="name"
            value={brandForm.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={brandForm.status}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ marginTop: '16px' }}
          />
          {brandForm.logo && <img src={URL.createObjectURL(brandForm.logo)} alt="Logo Preview" width={100} style={{ marginTop: '16px' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="primary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa thương hiệu này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Hủy</Button>
          <Button onClick={handleDeleteConfirmed} color="secondary">Xóa</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default BrandTable;
