import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Header/Header';
import './App.css';
import CategoryNav from '../Header/CategoryNav';
import Category from '../Category/Category';
import Home from '../Home/Home';
import Product from '../Product/Product';
import Footer from '../Footer/Footer';
import Search from '../Search/Search';
import { lazy, useEffect } from 'react';
import { Suspense } from 'react';
import Spinner from '../Spinner/Spinner';

// const Home = lazy(async () => {
//   return new Promise(resolve => setTimeout(resolve, 2000)).then(
//     () => import("../Home/Home")
//   );
// });

import Login from '../Auth/Login';
import Signup from '../Auth/Signup';
import AdminDashboard from '../Admin/AdminDashboard';
import AddProduct from '../Admin/AddProduct';
import ProductList from '../Admin/ProductList';
import OrderList from '../Admin/OrderList';
import UserList from '../Admin/UserList';
import CategoryList from '../Admin/CategoryList';
import ChatWidget from '../Chat/ChatWidget';
import AdminChat from '../Chat/AdminChat';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import Orders from '../User/Orders';
import OrderSuccess from '../User/OrderSuccess';

function App() {
  const { user } = useSelector((state) => state.authState);

  const ProtectedRoute = ({ children }) => {
      const { user } = useSelector((state) => state.authState);
      if (!user) {
          return <Navigate to="/login" replace />;
      }
      return children;
  };

  const ProtectedAdminRoute = ({ children }) => {
      const { user } = useSelector((state) => state.authState);
      if (!user) {
          return <Navigate to="/login" replace />;
      }
      if (user.role !== 'admin') {
          return <Navigate to="/" replace />;
      }
      return children;
  };

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer position="top-right" autoClose={3000} />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Header />
            <CategoryNav />
            <ChatWidget />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedAdminRoute>
                        <AdminDashboard />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/categories" element={
                    <ProtectedAdminRoute>
                        <CategoryList />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/add-product" element={
                    <ProtectedAdminRoute>
                        <AddProduct />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/chat" element={
                    <ProtectedAdminRoute>
                        <AdminChat />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedAdminRoute>
                        <ProductList />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedAdminRoute>
                        <OrderList />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedAdminRoute>
                        <UserList />
                    </ProtectedAdminRoute>
                } />

                {/* User Protected Routes */}
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="/order-success" element={
                    <ProtectedRoute>
                        <OrderSuccess />
                    </ProtectedRoute>
                } />

                {/* Public Routes */}
                <Route path="/search" element={<Search />} />
                <Route path="/:categoryTitle/" element={<Category />} />
                <Route path="/:catTitle/:subID/:productID/" element={<Product />} />
            </Routes>
                <Footer />
            </BrowserRouter>
        </ThemeProvider>
    </div>
  );
}

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';

export default App;
