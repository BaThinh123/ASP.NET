import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    orderId: '',
    paymentMethod: '',
    paymentStatus: 'Pending',
    amount: 0,
    createdBy: 'admin',
  });
  const [paymentIdToDelete, setPaymentIdToDelete] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    axios.get('/Payment', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy thanh toán:', error));
  }, []);

  const handleDeleteConfirmation = (paymentId) => {
    setPaymentIdToDelete(paymentId);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    if (paymentIdToDelete !== null) {
      axios.delete(`/Payment/${paymentIdToDelete}`)
        .then(() => {
          setPayments(payments.filter(payment => payment.id !== paymentIdToDelete));
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Lỗi khi xóa thanh toán:', error);
          setOpenDialog(false);
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPaymentIdToDelete(null);
    setEditingPayment(null);
  };

  const handleAddPayment = () => {
    if (!newPayment.orderId || !newPayment.paymentMethod || newPayment.amount <= 0) {
      alert('Vui lòng điền đầy đủ thông tin thanh toán!');
      return;
    }

    axios.post('/Payment', newPayment, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setPayments([...payments, response.data]);
        setOpenDialog(false);
        alert('Thêm thanh toán thành công!');
      })
      .catch(error => {
        console.error('Lỗi khi thêm thanh toán:', error);
        alert('Thêm thanh toán thất bại!');
      });
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setNewPayment({ ...payment });
    setOpenDialog(true);
  };

  const handleSaveEditPayment = () => {
    if (!newPayment.orderId || !newPayment.paymentMethod || newPayment.amount <= 0) {
      alert('Vui lòng điền đầy đủ thông tin thanh toán!');
      return;
    }

    const updatedPayment = {
      ...newPayment,
      updatedBy: 'admin',
    };

    axios.put(`/Payment/${editingPayment.id}`, updatedPayment, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setPayments(payments.map(payment =>
          payment.id === editingPayment.id ? response.data : payment
        ));
        setOpenDialog(false);
        alert('Cập nhật thanh toán thành công!');
      })
      .catch(error => {
        if (error.response) {
          console.error('Lỗi từ server:', error.response.data);
          alert(`Lỗi: ${error.response.data.message || 'Cập nhật thanh toán thất bại!'}`);
        } else if (error.request) {
          console.error('Không nhận được phản hồi từ server:', error.request);
          alert('Không nhận được phản hồi từ server, vui lòng thử lại.');
        } else {
          console.error('Lỗi thiết lập yêu cầu:', error.message);
          alert('Lỗi trong quá trình gửi yêu cầu. Vui lòng thử lại.');
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Chưa cập nhật' : date.toLocaleString();
  };

  return (
    <MainCard title="Danh sách thanh toán">
      <Button variant="contained" color="primary" onClick={() => { setOpenDialog(true); setEditingPayment(null); }} sx={{ marginBottom: 2 }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>Phương thức thanh toán</strong></TableCell>
              <TableCell><strong>Trạng thái thanh toán</strong></TableCell>
              <TableCell><strong>Số tiền</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Ngày cập nhật</strong></TableCell>
              <TableCell><strong>Người cập nhật</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>{payment.paymentStatus}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>{payment.createdBy || 'Chưa cập nhật'}</TableCell>
                <TableCell>{formatDate(payment.updatedAt)}</TableCell>
                <TableCell>{payment.updatedBy || 'Chưa cập nhật'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditPayment(payment)} sx={{ mr: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteConfirmation(payment.id)}>
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

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openDialog && paymentIdToDelete === null} onClose={handleCloseDialog}>
        <DialogTitle>{editingPayment ? 'Chỉnh sửa thanh toán' : 'Thêm mới thanh toán'}</DialogTitle>
        <DialogContent>
          <TextField label="Order ID" name="orderId" value={newPayment.orderId} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Phương thức thanh toán" name="paymentMethod" value={newPayment.paymentMethod} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Trạng thái thanh toán" name="paymentStatus" value={newPayment.paymentStatus} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Số tiền" name="amount" type="number" value={newPayment.amount} onChange={handleInputChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={editingPayment ? handleSaveEditPayment : handleAddPayment}>
            {editingPayment ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDialog && paymentIdToDelete !== null} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa thanh toán này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleDelete} color="secondary">Xóa</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default PaymentTable;
