import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API_URL from '../../utils/apiConfig';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.authState);

    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/orders/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Orders data:', data);
                if (data.status === 'success') {
                    setOrders(data.data || []);
                } else {
                    console.error('Failed to fetch orders:', data.message);
                    setOrders([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching orders:', err);
                setLoading(false);
            });
        }
    }, [token]);

    if (loading) return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-noon-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 mb-4">You have no orders yet.</p>
                        <Link to="/" className="text-noon-blue font-bold hover:underline">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-700">#{order._id}</span></p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{order.totalOrderPrice} EGP</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.isPaid ? 'Paid' : 'Pending Payment'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                     {order.cartItems.map((item, idx) => (
                                         <div key={idx} className="flex items-center gap-4">
                                             <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                 {/* Using placeholder or product image if available in order populated data */}
                                                <i className="fas fa-box text-gray-400"></i>
                                             </div>
                                             <div>
                                                 <p className="text-sm font-medium">{item.product?.title || "Product details unavailable"}</p>
                                                 <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                             </div>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
