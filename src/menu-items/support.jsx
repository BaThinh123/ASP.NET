// assets
import {
  ChromeOutlined,
  QuestionOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  MailOutlined,
  BarsOutlined // ✅ Icon cho CartItem
} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  MailOutlined,
  BarsOutlined // ✅ Gán icon cho CartItem
};

// ==============================|| MENU ITEMS - SAMPLE PAGE, PRODUCT, BRAND, CONTACT, CART ITEM & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Cart',
      type: 'item',
      url: '/sample-page',
      icon: icons.ChromeOutlined
    },
    {
      id: 'product-page',
      title: 'Product',
      type: 'item',
      url: '/product',
      icon: icons.ShoppingCartOutlined
    },
    {
      id: 'brand-page',
      title: 'Brand',
      type: 'item',
      url: '/brand',
      icon: icons.AppstoreAddOutlined
    },
    {
      id: 'contact-page',
      title: 'Contact',
      type: 'item',
      url: '/contact',
      icon: icons.MailOutlined
    },
    {
      id: 'cart-item-page', // ✅ ID cho CartItem
      title: 'Cart Item', // ✅ Tiêu đề menu
      type: 'item',
      url: '/cart-item', // ✅ Đường dẫn trang CartItemTable
      icon: icons.BarsOutlined // ✅ Icon danh sách
    },
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
