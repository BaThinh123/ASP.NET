import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const OrderDetailTable = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [detailForm, setDetailForm] = useState({
    orderId: '', productId: '', quantity: '', unitPrice: '', createdBy: '', updatedBy: '', id: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get('/OrderDetail', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => setOrderDetails(response.data))
      .catch(error => console.error('Lỗi khi lấy chi tiết đơn hàng:', error));

    axios.get('/Product', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => setProducts(response.data))
      .catch(error => console.error('Lỗi khi lấy danh sách sản phẩm:', error));
  }, []);

  const handleSave = () => {
    if (!detailForm.orderId || !detailForm.productId || !detailForm.quantity || !detailForm.unitPrice) {
      console.error('OrderId, ProductId, Quantity và UnitPrice là bắt buộc!');
      return;
    }

    const requestBody = {
      id: detailForm.id,
      orderId: parseInt(detailForm.orderId), // Đảm bảo rằng OrderId là số
      productId: parseInt(detailForm.productId), // Đảm bảo rằng ProductId là số
      quantity: parseInt(detailForm.quantity), // Đảm bảo rằng Quantity là số
      unitPrice: parseFloat(detailForm.unitPrice), // Đảm bảo rằng UnitPrice là số
      createdAt: new Date().toISOString(), // Tạo thời gian UTC ISO cho CreatedAt
      createdBy: detailForm.createdBy || 'admin',
      updatedAt: detailForm.updatedAt || null,
      updatedBy: detailForm.updatedBy || null,
    };

    console.log(requestBody); // Kiểm tra dữ liệu trước khi gửi

    const action = editing
      ? axios.put(`/OrderDetail/${detailForm.id}`, requestBody)
      : axios.post('/OrderDetail', requestBody);

    action.then(response => {
      if (editing) {
        setOrderDetails(orderDetails.map(d => d.id === detailForm.id ? response.data : d));
      } else {
        setOrderDetails([...orderDetails, response.data]);
      }
      resetForm();
      alert(editing ? 'Cập nhật chi tiết đơn hàng thành công!' : 'Thêm chi tiết đơn hàng thành công!');
    })
    .catch(error => {
      console.error('Lỗi khi lưu chi tiết đơn hàng:', error);
      alert('Lỗi khi lưu. Vui lòng kiểm tra lại dữ liệu.');
    });
  };

  const handleEdit = (detail) => {
    setDetailForm({
      id: detail.id,
      orderId: detail.orderId || '',
      productId: detail.productId || '',
      quantity: detail.quantity || '',
      unitPrice: detail.unitPrice || '',
      createdBy: detail.createdBy || '',
      updatedBy: detail.updatedBy || ''
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/OrderDetail/${id}`)
      .then(() => setOrderDetails(orderDetails.filter(d => d.id !== id)))
      .catch(error => console.error('Lỗi khi xóa chi tiết đơn hàng:', error));
  };

  const resetForm = () => {
    setDetailForm({ orderId: '', productId: '', quantity: '', unitPrice: '', createdBy: '', updatedBy: '', id: null });
    setEditing(false);
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDetailForm({ ...detailForm, [name]: value });
  };

  return (
    <MainCard title="Chi tiết đơn hàng">
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>Product ID</strong></TableCell>
              <TableCell><strong>Số lượng</strong></TableCell>
              <TableCell><strong>Đơn giá</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Ngày cập nhật</strong></TableCell>
              <TableCell><strong>Người cập nhật</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.length > 0 ? orderDetails.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.id}</TableCell>
                <TableCell>{detail.orderId}</TableCell>
                <TableCell>{detail.productId}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>{detail.unitPrice.toLocaleString()} VNĐ</TableCell>
                <TableCell>{new Date(detail.createdAt).toLocaleString()}</TableCell>
                <TableCell>{detail.createdBy}</TableCell>
                <TableCell>{detail.updatedAt ? new Date(detail.updatedAt).toLocaleString() : 'Chưa cập nhật'}</TableCell>
                <TableCell>{detail.updatedBy || 'Chưa cập nhật'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(detail)} sx={{ marginRight: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(detail.id)}>
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

      <Dialog open={openDialog} onClose={resetForm}>
        <DialogTitle>{editing ? 'Chỉnh sửa chi tiết đơn hàng' : 'Thêm chi tiết đơn hàng'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Order ID"
            name="orderId"
            value={detailForm.orderId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              name="productId"
              value={detailForm.productId}
              onChange={handleInputChange}
              fullWidth
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Số lượng"
            name="quantity"
            type="number"
            value={detailForm.quantity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Đơn giá"
            name="unitPrice"
            type="number"
            value={detailForm.unitPrice}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Người tạo"
            name="createdBy"
            value={detailForm.createdBy || 'admin'}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Người cập nhật"
            name="updatedBy"
            value={detailForm.updatedBy}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="primary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default OrderDetailTable;
