import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../redux/slices/cartSlice';
import styles from './Cart.module.css';
import { Link } from 'react-router-dom';

const Cart = () => {
    const dispatch = useDispatch();
    const { cartItems, totalCartPrice, isLoading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.cart_container}>
            <h1 className={styles.cart_title}>Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className={styles.empty_cart}>
                    <p>Your cart is empty.</p>
                    <Link to="/" className={styles.continue_shopping}>Continue Shopping</Link>
                </div>
            ) : (
                <div className={styles.cart_content}>
                    <div className={styles.cart_items}>
                        {cartItems.map((item) => (
                            <div key={item._id} className={styles.cart_item}>
                                <img src={item.product.imageCover} alt={item.product.title} className={styles.item_image} />
                                <div className={styles.item_details}>
                                    <h3 className={styles.item_title}>{item.product.title}</h3>
                                    <p className={styles.item_color}>Color: {item.color}</p>
                                    <p className={styles.item_price}>{item.price} EGP</p>
                                    <button 
                                        className={styles.remove_btn}
                                        onClick={() => handleRemove(item._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.cart_summary}>
                        <h2>Order Summary</h2>
                        <div className={styles.summary_row}>
                            <span>Subtotal</span>
                            <span>{totalCartPrice} EGP</span>
                        </div>
                         <div className={styles.summary_row}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className={`${styles.summary_row} ${styles.total}`}>
                            <span>Total</span>
                            <span>{totalCartPrice} EGP</span>
                        </div>
                        <button className={styles.checkout_btn}>Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
