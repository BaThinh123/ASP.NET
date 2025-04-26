import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', salePrice: '', stock: '', imageUrl: '', 
    brandId: '', categoryId: '', status: 'Available', createdBy: '', id: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);  // Trạng thái loading

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Lấy sản phẩm
    axios.get('/Product', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setProducts(response.data);
        setLoading(false);  // Đặt loading là false khi dữ liệu đã được lấy về
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        setLoading(false);  // Đặt loading là false nếu có lỗi xảy ra
      });

    // Lấy thương hiệu
    axios.get('/Brand', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBrands(res.data))
      .catch(err => console.error('Lỗi khi lấy brand:', err));

    // Lấy danh mục
    axios.get('/Category', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi khi lấy category:', err));
  }, []);

  const resetForm = () => {
    setProductForm({
      name: '', description: '', price: '', salePrice: '', stock: '', imageUrl: '',
      brandId: '', categoryId: '', status: 'Available', createdBy: '', id: null
    });
    setOpenDialog(false);
    setEditing(false);
  };

  const handleSave = () => {
    console.log('Dữ liệu sản phẩm:', productForm);

    if (!productForm.name || !productForm.price || !productForm.status) {
      alert('Tên, giá và trạng thái là bắt buộc!');
      return;
    }

    const requestBody = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
      stock: Number(productForm.stock),
      imageUrl: productForm.imageUrl,
      status: productForm.status,
      createdBy: 'admin',
      brandId: productForm.brandId ? Number(productForm.brandId) : null,
      categoryId: productForm.categoryId ? Number(productForm.categoryId) : null,
    };

    if (editing) {
      requestBody.id = productForm.id;
    }

    const token = localStorage.getItem('token');

    if (editing) {
      console.log('Cập nhật sản phẩm ID:', productForm.id);
      console.log('Body gửi đi:', requestBody);

      axios.put(`/Product/${productForm.id}`, requestBody, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setProducts(products.map(prod => prod.id === productForm.id ? response.data : prod));
          resetForm();
          alert('Cập nhật sản phẩm thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi sửa sản phẩm:', error.response?.data || error.message);
          alert(error.response?.data?.message || 'Có lỗi khi cập nhật sản phẩm');
        });
    } else {
      console.log('Thêm mới sản phẩm:', requestBody);

      axios.post('/Product', requestBody, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setProducts([...products, response.data]);
          resetForm();
          alert('Thêm sản phẩm thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
          alert(error.response?.data?.message || 'Có lỗi khi thêm sản phẩm');
        });
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      salePrice: product.salePrice || '',
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      status: product.status,
      createdBy: product.createdBy || '',
      brandId: product.brandId || '',
      categoryId: product.categoryId || ''
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (productId) => {
    const token = localStorage.getItem('token');
    axios.delete(`/Product/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setProducts(products.filter(prod => prod.id !== productId));
        alert('Xóa sản phẩm thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi xóa sản phẩm:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Có lỗi khi xóa sản phẩm');
      });
  };

  const handleCloseDialog = () => {
    resetForm();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductForm({ ...productForm, [name]: value });
  };

  return (
    <MainCard title="Danh sách sản phẩm">
      <Button variant="contained" color="primary" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm mới
      </Button>

      {loading ? (
        <Typography variant="h6" align="center">Đang tải dữ liệu...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Tên</strong></TableCell>
                <TableCell><strong>Mô tả</strong></TableCell>
                <TableCell><strong>Giá</strong></TableCell>
                <TableCell><strong>Giá khuyến mãi</strong></TableCell>
                <TableCell><strong>Tồn kho</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Ngày tạo</strong></TableCell>
                <TableCell><strong>Người tạo</strong></TableCell>
                <TableCell><strong>Hình ảnh</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? products.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>{prod.id}</TableCell>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.description}</TableCell>
                  <TableCell>{prod.price ? prod.price.toLocaleString() : 'Chưa có giá'} VNĐ</TableCell>
                  <TableCell>{prod.salePrice ? prod.salePrice.toLocaleString() : 'Không có'}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>{prod.status}</TableCell>
                  <TableCell>{prod.createdAt ? new Date(prod.createdAt).toLocaleString() : 'Chưa có thời gian'}</TableCell>
                  <TableCell>{prod.createdBy}</TableCell>
                  <TableCell>
                    {prod.imageUrl && <img src={prod.imageUrl} alt={prod.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(prod)} sx={{ marginRight: 1 }}>
                      Sửa
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(prod.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên sản phẩm" name="name" value={productForm.name} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Mô tả" name="description" value={productForm.description} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Giá" name="price" type="number" value={productForm.price} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Giá khuyến mãi" name="salePrice" type="number" value={productForm.salePrice} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Tồn kho" name="stock" type="number" value={productForm.stock} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="URL hình ảnh" name="imageUrl" value={productForm.imageUrl} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Trạng thái" name="status" value={productForm.status} onChange={handleInputChange} fullWidth margin="normal" />

          <TextField
            select
            label="Thương hiệu"
            name="brandId"
            value={productForm.brandId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </TextField>

          <TextField
            select
            label="Danh mục"
            name="categoryId"
            value={productForm.categoryId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </TextField>

          <TextField label="Người tạo" value="admin" disabled fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ProductTable;
