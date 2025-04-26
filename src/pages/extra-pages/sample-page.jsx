import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const CartTable = () => {
  const [carts, setCarts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCart, setNewCart] = useState({
    userId: '',
    createdBy: 'admin',  // Giả sử giá trị này là 'admin'
  });
  const [cartIdToDelete, setCartIdToDelete] = useState(null);

  // Lấy danh sách giỏ hàng
  useEffect(() => {
    axios.get('/Cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setCarts(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy giỏ hàng:', error));
  }, []);

  // Xử lý xác nhận xóa giỏ hàng
  const handleDeleteConfirmation = (cartId) => {
    setCartIdToDelete(cartId);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    if (cartIdToDelete !== null) {
      axios.delete(`/Cart/${cartIdToDelete}`)
        .then(() => {
          setCarts(carts.filter(cart => cart.id !== cartIdToDelete));
          setOpenDialog(false); // Đóng dialog sau khi xóa
        })
        .catch(error => {
          console.error('Lỗi khi xóa giỏ hàng:', error);
          setOpenDialog(false); // Đóng dialog nếu có lỗi
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Đóng dialog mà không xóa
    setCartIdToDelete(null); // Đặt lại cartIdToDelete
  };

  const handleAddCart = () => {
    if (!newCart.userId) {
      alert('Vui lòng điền đầy đủ thông tin giỏ hàng!');
      return;
    }

    axios.post('/Cart', newCart, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setCarts([...carts, response.data]);
        setOpenDialog(false);
        alert('Thêm giỏ hàng thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi thêm giỏ hàng:', error);
        alert('Thêm giỏ hàng thất bại!');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCart({ ...newCart, [name]: value });
  };

  return (
    <MainCard title="Danh sách giỏ hàng">
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ marginBottom: 2 }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Ngày cập nhật</strong></TableCell>
              <TableCell><strong>Người cập nhật</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carts.length > 0 ? carts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell>{cart.id}</TableCell>
                <TableCell>{cart.userId}</TableCell>
                <TableCell>{new Date(cart.createdAt).toLocaleString()}</TableCell>
                <TableCell>{cart.createdBy}</TableCell>
                <TableCell>{cart.updatedAt ? new Date(cart.updatedAt).toLocaleString() : 'Chưa cập nhật'}</TableCell>
                <TableCell>{cart.updatedBy || 'Chưa cập nhật'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteConfirmation(cart.id)}>
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

      {/* Dialog Thêm mới giỏ hàng */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thêm mới giỏ hàng</DialogTitle>
        <DialogContent>
          <TextField
            label="User ID"
            name="userId"
            value={newCart.userId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Hủy</Button>
          <Button onClick={handleAddCart} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDialog && cartIdToDelete !== null} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa giỏ hàng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CartTable;
