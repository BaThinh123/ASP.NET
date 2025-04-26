import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// icons
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

export default function ProfileTab({ handleLogout }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  console.log('userId from localStorage:', userId); // Debugging line

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* Edit Profile */}
      <ListItemButton onClick={() => navigate(`/User/edit/${userId}`)}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Chỉnh sửa hồ sơ" />
      </ListItemButton>

      {/* View Profile */}
      <ListItemButton onClick={() => navigate(`/User/${userId}`)}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Xem hồ sơ" />
      </ListItemButton>

      {/* Social Profile (This could be linked to a social media page or additional functionality) */}
      <ListItemButton>
        <ListItemIcon>
          <ProfileOutlined />
        </ListItemIcon>
        <ListItemText primary="Hồ sơ mạng xã hội" />
      </ListItemButton>

      {/* Billing (If applicable, it could redirect to a billing page or payment portal) */}
      <ListItemButton>
        <ListItemIcon>
          <WalletOutlined />
        </ListItemIcon>
        <ListItemText primary="Hóa đơn" />
      </ListItemButton>

      {/* Logout Button */}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Đăng xuất" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = {
  handleLogout: PropTypes.func.isRequired,  // Logout function passed as prop
};
