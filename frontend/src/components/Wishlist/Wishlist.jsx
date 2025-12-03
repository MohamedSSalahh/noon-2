import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/slices/wishListSlice';
import styles from './Wishlist.module.css';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { wishlist, isLoading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.wishlist_container}>
            <h1 className={styles.wishlist_title}>My Wishlist</h1>
            
            {wishlist.length === 0 ? (
                <div className={styles.empty_wishlist}>
                    <p>Your wishlist is empty.</p>
                    <Link to="/" className={styles.continue_shopping}>Continue Shopping</Link>
                </div>
            ) : (
                <div className={styles.wishlist_grid}>
                    {wishlist.map((product) => (
                        <div key={product._id} className={styles.wishlist_item}>
                            <img src={product.imageCover} alt={product.title} className={styles.item_image} />
                            <div className={styles.item_details}>
                                <h3 className={styles.item_title}>{product.title}</h3>
                                <p className={styles.item_price}>{product.price} EGP</p>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.remove_btn}
                                        onClick={() => handleRemove(product._id)}
                                    >
                                        Remove
                                    </button>
                                    <Link to={`/${product.category.name}/${product.category._id}/${product._id}`} className={styles.view_btn}>
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
