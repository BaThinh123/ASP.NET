import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import api from '../../api/axios';  // Cấu hình API axios

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [contactForm, setContactForm] = useState({
    fullName: '', email: '', subject: '', message: '', status: 'Pending'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get('/Contact')
      .then(response => setContacts(response.data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  const handleSave = () => {
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) {
      alert('Full Name, Email, and Message are required!');
      return;
    }

    const requestBody = { ...contactForm };

    if (editing) {
      api.put(`/Contact/${contactForm.id}`, requestBody)
        .then(response => {
          setContacts(contacts.map(c => c.id === contactForm.id ? response.data : c));
          resetForm();
        })
        .catch(error => console.error('Error updating contact:', error));
    } else {
      api.post('/Contact', requestBody)
        .then(response => {
          setContacts([...contacts, response.data]);
          resetForm();
        })
        .catch(error => console.error('Error creating contact:', error));
    }
  };

  const handleEdit = (contact) => {
    setContactForm(contact);
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    api.delete(`/Contact/${id}`)
      .then(() => {
        setContacts(contacts.filter(c => c.id !== id));
      })
      .catch(error => console.error('Error deleting contact:', error));
  };

  const resetForm = () => {
    setContactForm({ fullName: '', email: '', subject: '', message: '', status: 'Pending' });
    setOpenDialog(false);
    setEditing(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm Liên Hệ
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Chủ Đề</TableCell>
              <TableCell>Nội Dung</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => (
              <TableRow key={contact.id}>
                <TableCell>{contact.id}</TableCell>
                <TableCell>{contact.fullName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.subject}</TableCell>
                <TableCell>{contact.message}</TableCell>
                <TableCell>{contact.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(contact)}>Sửa</Button>
                  <Button onClick={() => handleDelete(contact.id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={resetForm}>
        <DialogTitle>{editing ? 'Chỉnh sửa Liên Hệ' : 'Thêm Liên Hệ'}</DialogTitle>
        <DialogContent>
          <TextField label="Họ Tên" name="fullName" value={contactForm.fullName} onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })} />
          <TextField label="Email" name="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
          <TextField label="Chủ Đề" name="subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
          <TextField label="Nội Dung" name="message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
          <TextField label="Trạng Thái" name="status" value={contactForm.status} onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactTable;
