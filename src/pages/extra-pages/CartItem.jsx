import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const CartItemTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);  // Thêm state để lưu danh sách sản phẩm
  const [form, setForm] = useState({
    id: null,
    cartId: '',
    productId: '',
    quantity: 1,
    createdBy: '',
    updatedBy: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  // Lấy danh sách CartItems và Products khi component load
  useEffect(() => {
    // Lấy danh sách CartItems
    axios.get('/CartItem', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setCartItems(res.data))
      .catch(err => console.error('Lỗi khi tải CartItems:', err));

    // Lấy danh sách Products
    axios.get('/Product', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi khi tải Products:', err));
  }, []);

  const handleSave = () => {
    // Kiểm tra nếu các trường bắt buộc không có giá trị
    if (!form.cartId || !form.productId || !form.quantity) {
      console.error('CartId, ProductId và Quantity là bắt buộc!');
      return;
    }

    // Tạo đối tượng yêu cầu đúng định dạng
    const requestBody = {
      id: form.id ? form.id : null,  // Nếu có ID thì truyền, nếu không sẽ là null (để server tạo ID mới nếu là thêm mới)
      cartId: parseInt(form.cartId),
      productId: parseInt(form.productId),
      quantity: parseInt(form.quantity),
      createdBy: form.createdBy || 'admin',  // Gán mặc định nếu không có
      updatedBy: form.updatedBy || null,    // Gán null nếu không có
      createdAt: form.createdAt || new Date().toISOString(), // Thêm ngày tạo mặc định nếu không có
      updatedAt: form.updatedAt || null     // Cập nhật ngày sửa nếu có
    };

    // Log để kiểm tra requestBody
    console.log('Dữ liệu gửi lên:', requestBody);

    // Gọi API PUT nếu đang sửa, POST nếu là thêm mới
    const axiosCall = editing
      ? axios.put(`/CartItem/${form.id}`, requestBody)
      : axios.post('/CartItem', requestBody);

    axiosCall
      .then(res => {
        const updatedItem = res.data;
        setCartItems(prev =>
          editing
            ? prev.map(item => item.id === updatedItem.id ? updatedItem : item)
            : [...prev, updatedItem]
        );
        handleCloseDialog();
      })
      .catch(err => {
        // Log chi tiết lỗi
        console.error('Lỗi khi lưu:', err);
        if (err.response && err.response.data.errors) {
          // In chi tiết lỗi nếu có
          console.error('Chi tiết lỗi:', err.response.data.errors);
        }
      });
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      createdBy: item.createdBy || '',
      updatedBy: item.updatedBy || ''
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/CartItem/${id}`)
      .then(() => {
        setCartItems(cartItems.filter(item => item.id !== id));
      })
      .catch(err => console.error('Lỗi khi xóa:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCloseDialog = () => {
    setForm({
      id: null,
      cartId: '',
      productId: '',
      quantity: 1,
      createdBy: '',
      updatedBy: ''
    });
    setEditing(false);
    setOpenDialog(false);
  };

  return (
    <MainCard title="Danh sách CartItem">
      <Button variant="contained" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cart ID</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Người cập nhật</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length > 0 ? cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.cartId}</TableCell>
                <TableCell>{item.productId}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}</TableCell>
                <TableCell>{item.updatedBy || '—'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(item)} sx={{ mr: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(item.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Chỉnh sửa CartItem' : 'Thêm CartItem'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Cart ID"
            name="cartId"
            value={form.cartId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Chọn Sản phẩm</InputLabel>
            <Select
              name="productId"
              value={form.productId}
              onChange={handleInputChange}
            >
              {products.length > 0 ? products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              )) : (
                <MenuItem disabled>No products available</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Người tạo"
            name="createdBy"
            value={form.createdBy}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Người cập nhật"
            name="updatedBy"
            value={form.updatedBy}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CartItemTable;
