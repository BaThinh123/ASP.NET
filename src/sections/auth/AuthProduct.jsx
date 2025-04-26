import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

// material-ui
import {
  Box, Button, FormControl, FormHelperText, Grid, InputAdornment,
  InputLabel, OutlinedInput, Stack, Typography
} from '@mui/material';

import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function ProductForm() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false); // nếu muốn dùng cho mật khẩu admin quản lý sản phẩm

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        productName: '',
        description: '',
        price: '',
        category: '',
        password: '' // tùy chọn nếu có phần bảo vệ
      }}
      validationSchema={Yup.object().shape({
        productName: Yup.string().max(255).required('Product name is required'),
        description: Yup.string().max(1000, 'Too long'),
        price: Yup.number().required('Price is required').positive('Must be positive'),
        category: Yup.string().required('Category is required'),
        password: Yup.string().max(10, 'Must be less than 10 characters')
      })}
    >
      {({ errors, handleBlur, handleChange, touched, values }) => (
        <form noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack gap={1}>
                <InputLabel htmlFor="product-name">Product Name*</InputLabel>
                <OutlinedInput
                  id="product-name"
                  name="productName"
                  value={values.productName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="e.g. Apple iPhone 15"
                  fullWidth
                  error={Boolean(touched.productName && errors.productName)}
                />
              </Stack>
              {touched.productName && errors.productName && (
                <FormHelperText error>{errors.productName}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack gap={1}>
                <InputLabel htmlFor="category">Category*</InputLabel>
                <OutlinedInput
                  id="category"
                  name="category"
                  value={values.category}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  fullWidth
                  error={Boolean(touched.category && errors.category)}
                />
              </Stack>
              {touched.category && errors.category && (
                <FormHelperText error>{errors.category}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack gap={1}>
                <InputLabel htmlFor="price">Price ($)*</InputLabel>
                <OutlinedInput
                  id="price"
                  name="price"
                  type="number"
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="e.g. 999"
                  fullWidth
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  error={Boolean(touched.price && errors.price)}
                />
              </Stack>
              {touched.price && errors.price && (
                <FormHelperText error>{errors.price}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack gap={1}>
                <InputLabel htmlFor="description">Description</InputLabel>
                <OutlinedInput
                  id="description"
                  name="description"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  fullWidth
                  multiline
                  rows={4}
                  error={Boolean(touched.description && errors.description)}
                />
              </Stack>
              {touched.description && errors.description && (
                <FormHelperText error>{errors.description}</FormHelperText>
              )}
            </Grid>

            {/* Optional password field */}
            <Grid item xs={12}>
              <Stack gap={1}>
                <InputLabel htmlFor="password">Admin Password (Optional)</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                <Typography variant="subtitle2">{level?.label}</Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <AnimateButton>
                <Button fullWidth size="large" variant="contained" color="primary">
                  Save Product
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
