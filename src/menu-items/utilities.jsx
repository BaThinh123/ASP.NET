// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UserOutlined,
  FileTextOutlined, // ✅ thêm icon phù hợp cho Blog
  CreditCardOutlined // ✅ thêm icon Payment
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  FileTextOutlined, // ✅ thêm icon Blog
  CreditCardOutlined // ✅ thêm icon Payment
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Category',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-category',
      title: 'Order',
      type: 'item',
      url: '/category',
      icon: icons.AppstoreAddOutlined
    },

    {
      id: 'util-orderdetail',
      title: 'OrderDetail',
      type: 'item',
      url: '/orderdetail',
      icon: icons.AppstoreAddOutlined
    },
    {
      id: 'util-user',
      title: 'User',
      type: 'item',
      url: '/User',
      icon: icons.UserOutlined,
      target: false
    },
    {
      id: 'util-blog',
      title: 'Blog',
      type: 'item',
      url: '/blog',
      icon: icons.FileTextOutlined, // ✅ dùng icon văn bản cho blog
      target: false
    },
    {
      id: 'util-payment', // Mã ID cho Payment
      title: 'Payment',  // Tiêu đề "Payment"
      type: 'item',
      url: '/payment',  // Đường dẫn URL cho Payment
      icon: icons.CreditCardOutlined, // Dùng icon CreditCardOutlined cho Payment
      target: false
    }
  ]
};

export default utilities;
