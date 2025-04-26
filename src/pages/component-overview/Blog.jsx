import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import axios from '../../api/axios';

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({
    id: null, title: '', content: '', imageUrl: '', status: '', createdBy: '', updatedBy: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get('/Blog', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Blogs:', response.data);
        setBlogs(response.data);
      })
      .catch(error => console.error('Error fetching blogs:', error));
  }, []);

  const handleSave = () => {
    if (!blogForm.title || !blogForm.content || !blogForm.status) {
      console.error('Title, content, and status are required!');
      return;
    }

    const requestBody = {
      id: blogForm.id,
      title: blogForm.title,
      content: blogForm.content,
      imageUrl: blogForm.imageUrl,
      status: blogForm.status,
      createdBy: blogForm.createdBy,
      updatedBy: blogForm.updatedBy
    };

    if (editing) {
      axios.put(`/Blog/${blogForm.id}`, requestBody)
        .then(response => {
          setBlogs(blogs.map(blog => blog.id === blogForm.id ? response.data : blog));
          resetForm();
          alert('Blog updated successfully!');
        })
        .catch(error => console.error('Error updating blog:', error));
    } else {
      axios.post('/Blog', requestBody)
        .then(response => {
          setBlogs([...blogs, response.data]);
          resetForm();
        })
        .catch(error => console.error('Error creating blog:', error));
    }
  };

  const handleEdit = (blog) => {
    setBlogForm({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl || '',
      status: blog.status,
      createdBy: blog.createdBy || '',
      updatedBy: blog.updatedBy || ''
    });
    setEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/Blog/${id}`)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id));
      })
      .catch(error => console.error('Error deleting blog:', error));
  };

  const resetForm = () => {
    setBlogForm({
      id: null, title: '', content: '', imageUrl: '', status: '', createdBy: '', updatedBy: ''
    });
    setOpenDialog(false);
    setEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBlogForm({ ...blogForm, [name]: value });
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
    <MainCard title="Danh sách Blog">
      <Button variant="contained" color="primary" onClick={() => { setOpenDialog(true); setEditing(false); }}>
        Thêm mới
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Tiêu đề</strong></TableCell>
              <TableCell><strong>Nội dung</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Người tạo</strong></TableCell>
              <TableCell><strong>Ngày cập nhật</strong></TableCell>
              <TableCell><strong>Người cập nhật</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.length > 0 ? blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.id}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.content?.substring(0, 100)}...</TableCell>
                <TableCell>{blog.status}</TableCell>
                <TableCell>{formatDate(blog.createdAt)}</TableCell>
                <TableCell>{blog.createdBy}</TableCell>
                <TableCell>{formatDate(blog.updatedAt)}</TableCell>
                <TableCell>{blog.updatedBy}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(blog)} sx={{ marginRight: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(blog.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={resetForm}>
        <DialogTitle>{editing ? 'Chỉnh sửa Blog' : 'Thêm Blog'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            name="title"
            value={blogForm.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nội dung"
            name="content"
            value={blogForm.content}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Link ảnh"
            name="imageUrl"
            value={blogForm.imageUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={blogForm.status}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Người tạo"
            name="createdBy"
            value={blogForm.createdBy}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Người cập nhật"
            name="updatedBy"
            value={blogForm.updatedBy}
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

export default BlogTable;
