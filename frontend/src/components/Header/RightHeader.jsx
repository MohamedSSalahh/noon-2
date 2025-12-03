import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const RightHeader = ({ styles }) => {
    const { user } = useSelector((state) => state.authState);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className={styles.right_header}>
            
            {/* Language */}
            <h3 className={styles.language}>العربية</h3>
            <span className={styles.divider}></span>

            {/* Authentication + Admin */}
            {user ? (
                <div className={styles.user_menu}>
                    <div className={styles.flex_container} onClick={handleLogout}>
                        <h3 className={styles.icon_text}>Sign Out</h3>
                        <i className="fas fa-user"></i>
                    </div>
                    {user.role === 'admin' && (
                         <Link to="/admin" className={styles.flex_container}>
                            <h3 className={styles.icon_text}>Admin</h3>
                         </Link>
                    )}
                </div>
            ) : (
                <Link to="/login" className={styles.flex_container}>
                    <h3 className={styles.icon_text}>Sign In</h3>
                    <i className="fas fa-user"></i>
                </Link>
            )}

            <span className={styles.divider}></span>

            {/* Cart */}
            <Link to="/cart" className={styles.flex_container}>
                <h3 className={styles.icon_text}>Cart</h3>
                <i className="fas fa-shopping-cart"></i>
            </Link>

             <span className={styles.divider}></span>

             {/* Wishlist */}
             <Link to="/wishlist" className={styles.flex_container}>
                <h3 className={styles.icon_text}>Wishlist</h3>
                <i className="fas fa-heart"></i>
             </Link>

        </div>
    );
};

export default RightHeader;
