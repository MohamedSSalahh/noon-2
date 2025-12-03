import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../../apis/categories';
import styles from './Admin.module.css';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categoryState);
    const { token } = useSelector((state) => state.authState);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        imageCover: null
    });
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getCategories(dispatch);
    }, [dispatch]);

    const handleChange = (e) => {
        if (e.target.name === 'imageCover') {
            setFormData({ ...formData, imageCover: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('quantity', formData.quantity);
        data.append('category', formData.category);
        data.append('imageCover', formData.imageCover);
        // Required by backend model
        data.append('slug', formData.title.toLowerCase().replace(/ /g, '-')); 

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setIsError(false);
                setMessage('Product added successfully!');
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    quantity: '',
                    category: '',
                    imageCover: null
                });
            } else {
                setIsError(true);
                setMessage(result.message || 'Failed to add product');
            }
        } catch (error) {
            setIsError(true);
            setMessage('Network error occurred');
        }
    };

    return (
        <div className={styles.admin_container}>
            <div className={styles.form_container}>
                <h2>Add New Product</h2>
                {message && (
                    <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className={styles.form_group}>
                        <label>Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.form_group}>
                        <label>Image Cover</label>
                        <input
                            type="file"
                            name="imageCover"
                            onChange={handleChange}
                            accept="image/*"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submit_btn}>Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
