import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Admin.module.css';

const AdminDashboard = () => {
    return (
        <div className={styles.admin_container}>
            <div className={styles.dashboard_header}>
                <h1>Admin Dashboard</h1>
                <Link to="/admin/add-product" className={styles.add_product_btn}>
                    Add New Product
                </Link>
            </div>
            <div className={styles.dashboard_content}>
                <p>Welcome to the Admin Panel. Use the button above to add new products.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
