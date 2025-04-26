import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute'; // Thêm dòng này
import EditProfile from 'layout/Dashboard/Header/EditProfile';
// render - Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - component overview
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const UserTable = Loadable(lazy(() => import('pages/component-overview/user'))); 
const AdminCategory = Loadable(lazy(() => import('pages/component-overview/category')));
const BlogTable = Loadable(lazy(() => import('pages/component-overview/blog'))); 
const OrderDetailTable = Loadable(lazy(() => import('pages/component-overview/orderdetail'))); // Đường dẫn đến trang OrderDetailTable
const PaymentTable = Loadable(lazy(() => import('pages/component-overview/payment'))); // Đường dẫn đến trang PaymentTable
// render - sample pages
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const AdminProduct = Loadable(lazy(() => import('pages/extra-pages/product')));
const AdminBrand = Loadable(lazy(() => import('pages/extra-pages/brand')));
const ContactTable = Loadable(lazy(() => import('pages/extra-pages/contact')));
const CartItemTable = Loadable(lazy(() => import('pages/extra-pages/cartitem'))); 
 // Đường dẫn đến trang OrderDetailTable

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'product',
      element: <AdminProduct />
    },
    {
      path: 'brand',
      element: <AdminBrand />
    },
    {
      path: 'category',
      element: <AdminCategory />
    },

    {
      path: 'blog',
      element: <BlogTable />
    },

    {
      path: 'contact',
      element: <ContactTable />
    },

    {
      path: 'cart-item', // ✅ Đường dẫn trang CartItemTable
      element: <CartItemTable />
    },

    {
      path: 'payment', // ✅ Đường dẫn trang CartItemTable
      element: <PaymentTable />
    },

    {
      path: 'orderdetail', // ✅ Đường dẫn trang CartItemTable
      element: <OrderDetailTable />
    },


    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'user', // Profile page route
      element: <UserTable /> // Component for viewing user profile
    },
    {
      path: 'user/edit/:id', // Edit profile route
      element: <EditProfile /> // Component for editing the user profile
    },
  ]
};

export default MainRoutes;
