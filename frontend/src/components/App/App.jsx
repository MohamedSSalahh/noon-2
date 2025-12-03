import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './App.css';
import CategoryNav from '../Header/CategoryNav';
import styles from '../Header/CategoryNav.module.css';
import Category from '../Category/Category';
import Home from '../Home/Home';
import Product from '../Product/Product';
import Footer from '../Footer/Footer';
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
import ChatWidget from '../Chat/ChatWidget';
import AdminChat from '../Chat/AdminChat';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';

function App() {
  const { user } = useSelector((state) => state.authState);

  const ProtectedAdminRoute = ({ children }) => {
      if (!user || user.role !== 'admin') {
          return <Navigate to="/login" replace />;
      }
      return children;
  };

  return (
    <div className="App">
        <BrowserRouter>
            <Header />
            <CategoryNav />
            <ChatWidget />
                <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/admin" element={
                          <ProtectedAdminRoute>
                              <AdminDashboard />
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
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/:categoryTitle/" element={<Category />} />
                      <Route path="/:catTitle/:subID/:productID/" element={<Product />} />
                </Routes>
            <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App;
