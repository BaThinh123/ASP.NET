import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    userId: '',
    cartId: '',
    totalAmount: '',
    status: '',
    createdBy: 'admin',
  });
  const [carts, setCarts] = useState([]);  // State to store cart data

  // Fetch orders and carts from API
  useEffect(() => {
    axios.get('/Order', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy đơn hàng:', error));

    // Fetch cart data for dropdown
    axios.get('/Cart', {  // Assuming this is the correct API endpoint
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setCarts(response.data);  // Save carts data to state
      })
      .catch(error => console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error));
  }, []);

  const handleDelete = (orderId) => {
    axios.delete(`/Order/${orderId}`)
      .then(() => {
        setOrders(orders.filter(order => order.id !== orderId));
        alert('Xóa đơn hàng thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi xóa đơn hàng:', error);
        alert('Xóa đơn hàng thất bại!');
      });
  };

  const handleAddOrder = () => {
    if (!newOrder.userId || !newOrder.cartId || !newOrder.totalAmount || !newOrder.status) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    axios.post('/Order', newOrder, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setOrders([...orders, response.data]);
        setOpenDialog(false);
        alert('Thêm đơn hàng thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi thêm đơn hàng:', error);
        alert('Thêm đơn hàng thất bại!');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  return (
    <MainCard title="Danh sách đơn hàng">
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Cart ID</strong></TableCell>
              <TableCell><strong>Tổng tiền</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Ngày cập nhật</strong></TableCell>
              <TableCell><strong>Người cập nhật</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.cartId}</TableCell>
                <TableCell>{order.totalAmount.toLocaleString()} VNĐ</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>{order.createdBy}</TableCell>
                <TableCell>{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'Chưa cập nhật'}</TableCell>
                <TableCell>{order.updatedBy || 'Chưa cập nhật'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(order.id)}>
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

      {/* Dialog Thêm mới đơn hàng */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thêm mới đơn hàng</DialogTitle>
        <DialogContent>
          <TextField
            label="User ID"
            name="userId"
            value={newOrder.userId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {/* Dropdown cho Cart ID */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="cart-select-label">Cart ID</InputLabel>
            <Select
              labelId="cart-select-label"
              id="cart-select"
              value={newOrder.cartId}
              onChange={handleInputChange}
              name="cartId"
              label="Cart ID"
            >
              {carts.map(cart => (
                <MenuItem key={cart.id} value={cart.id}>
                  {cart.id} - {cart.name} {/* Thêm các trường thông tin cần thiết */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Tổng tiền"
            name="totalAmount"
            value={newOrder.totalAmount}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={newOrder.status}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Hủy</Button>
          <Button onClick={handleAddOrder} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default OrderTable;
